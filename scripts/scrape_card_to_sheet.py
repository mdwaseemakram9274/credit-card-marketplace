#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path
from typing import List, Dict, Any

import requests
from bs4 import BeautifulSoup
import gspread
from oauth2client.service_account import ServiceAccountCredentials


def to_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def extract_text(soup: BeautifulSoup, selector: str, default: str = "Unknown") -> str:
    node = soup.select_one(selector)
    return node.get_text(strip=True) if node else default


def extract_list(soup: BeautifulSoup, selector: str) -> List[str]:
    return [item.get_text(strip=True) for item in soup.select(selector)]


def parse_marketplace_js(js_text: str) -> Dict[str, Any]:
    payload = js_text
    payload = payload.replace("window.marketplaceData", "", 1).strip()
    if payload.startswith("="):
        payload = payload[1:].strip()
    if payload.endswith(";"):
        payload = payload[:-1].strip()

    payload = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)", r'\1"\2"\3', payload)
    payload = payload.replace("'", '"')
    return json.loads(payload)


def write_marketplace_js(file_path: Path, data: Dict[str, Any]) -> None:
    content = "window.marketplaceData = " + json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding="utf-8")


def upsert_marketplace_card(
    marketplace_file: Path,
    bank_slug: str,
    bank_name: str,
    card_slug: str,
    card_name: str,
    description: str,
) -> None:
    if marketplace_file.exists():
        parsed = parse_marketplace_js(marketplace_file.read_text(encoding="utf-8"))
    else:
        parsed = {"banks": []}

    banks = parsed.setdefault("banks", [])
    bank_entry = next((entry for entry in banks if entry.get("slug") == bank_slug), None)
    if bank_entry is None:
        bank_entry = {
            "slug": bank_slug,
            "name": bank_name,
            "description": f"Explore {bank_name}.",
            "cards": [],
        }
        banks.append(bank_entry)

    cards = bank_entry.setdefault("cards", [])
    existing = next((entry for entry in cards if entry.get("slug") == card_slug), None)
    payload = {
        "slug": card_slug,
        "name": card_name,
        "description": description,
    }

    if existing is None:
        cards.append(payload)
    else:
        existing.update(payload)

    write_marketplace_js(marketplace_file, parsed)


def fetch_card_data(url: str, bank: str, title_selector: str, fee_selector: str, benefit_selector: str) -> dict:
    response = requests.get(url, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    card_name = extract_text(soup, title_selector)
    fees = extract_text(soup, fee_selector)
    benefits = extract_list(soup, benefit_selector)

    return {
        "source_url": url,
        "bank": bank,
        "card_name": card_name,
        "fees": fees,
        "benefits": benefits,
    }


def append_to_google_sheet(service_account_file: str, spreadsheet_name: str, worksheet_name: str, data: dict) -> None:
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_name(service_account_file, scope)
    client = gspread.authorize(creds)
    sheet = client.open(spreadsheet_name).worksheet(worksheet_name)

    row = [
        data["bank"],
        data["card_name"],
        data["fees"],
        ", ".join(data["benefits"]),
        data["source_url"],
    ]
    sheet.append_row(row)


def generate_card_html(data: dict, output_dir: Path, bank_slug: str, apply_url: str) -> Path:
    output_dir = output_dir / bank_slug
    output_dir.mkdir(parents=True, exist_ok=True)
    slug = to_slug(data["card_name"] or "card")
    file_path = output_dir / f"{slug}.html"

    benefits_html = "".join(f"<li>{benefit}</li>" for benefit in data["benefits"]) or "<li>No benefits found</li>"

    html = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>
  <meta name=\"description\" content=\"{data['card_name']} details and application info\" />
  <title>{data['card_name']} - Details & Apply</title>
  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH\" crossorigin=\"anonymous\" />
  <style>
    body {{ background:#f8fbff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; }}
    .card-box {{ border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,.06); }}
  </style>
</head>
<body>
  <main class=\"container my-5\">
    <article class=\"card-box p-4 p-md-5 bg-white\">
      <h1 class=\"mb-2\">{data['card_name']} from {data['bank']}</h1>
      <p class=\"text-muted\">Fees: {data['fees']}</p>
      <h2 class=\"h5 mt-4\">Benefits</h2>
      <ul>
        {benefits_html}
      </ul>
      <a href=\"{apply_url}\" class=\"btn btn-primary\">Apply Now</a>
    </article>
  </main>
</body>
</html>
"""
    file_path.write_text(html, encoding="utf-8")
    return file_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape a credit card page, save to Google Sheets, and generate HTML.")
    parser.add_argument("--url", required=True, help="Source page URL")
    parser.add_argument("--bank", required=True, help="Bank name, e.g. HDFC")

    parser.add_argument("--title-selector", default="h1.card-title")
    parser.add_argument("--fee-selector", default="p.fee-info")
    parser.add_argument("--benefit-selector", default="li.benefit-item")

    parser.add_argument("--sheet-name", default="Credit Cards Sheet")
    parser.add_argument("--worksheet-name", default="Sheet1")
    parser.add_argument("--service-account-file", default="", help="Path to Google service account JSON file")
    parser.add_argument("--skip-sheet", action="store_true", help="Skip Google Sheets append")

    parser.add_argument("--output-dir", default="public/cards")
    parser.add_argument("--bank-slug", default="", help="Optional bank slug override, e.g. hdfc")
    parser.add_argument("--apply-url", default="#")
    parser.add_argument("--update-marketplace-data", action="store_true", help="Upsert card into marketplace-data.js")
    parser.add_argument("--marketplace-data-file", default="data/marketplace-data.js")
    parser.add_argument("--public-marketplace-data-file", default="public/data/marketplace-data.js")

    return parser.parse_args()


def main() -> None:
    args = parse_args()

    data = fetch_card_data(
        url=args.url,
        bank=args.bank,
        title_selector=args.title_selector,
        fee_selector=args.fee_selector,
        benefit_selector=args.benefit_selector,
    )

    print("Extracted data:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

    if not args.skip_sheet:
        if not args.service_account_file:
            raise ValueError("--service-account-file is required unless --skip-sheet is used")
        append_to_google_sheet(
            service_account_file=args.service_account_file,
            spreadsheet_name=args.sheet_name,
            worksheet_name=args.worksheet_name,
            data=data,
        )
        print("Data appended to Google Sheets")

    bank_slug = args.bank_slug or to_slug(args.bank)
    output_path = generate_card_html(data, Path(args.output_dir), bank_slug, args.apply_url)
    print(f"Generated card page: {output_path}")

    if args.update_marketplace_data:
        description = data["fees"] if data["fees"] != "Unknown" else ", ".join(data["benefits"][:2])
        description = description or "Card details and benefits"

        upsert_marketplace_card(
            marketplace_file=Path(args.marketplace_data_file),
            bank_slug=bank_slug,
            bank_name=args.bank,
            card_slug=to_slug(data["card_name"]),
            card_name=data["card_name"],
            description=description,
        )
        upsert_marketplace_card(
            marketplace_file=Path(args.public_marketplace_data_file),
            bank_slug=bank_slug,
            bank_name=args.bank,
            card_slug=to_slug(data["card_name"]),
            card_name=data["card_name"],
            description=description,
        )
        print("Marketplace data updated in data/ and public/data/")


if __name__ == "__main__":
    main()
