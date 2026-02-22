# Credit Card Marketplace

SEO-focused credit card marketplace with a dynamic static HTML flow:

- Home: `index.html` / `/`
- Bank list page: `/bank.html?bank=hdfc`
- Card detail page: `/card.html?bank=hdfc&card=millennia-credit-card`

## Local Development

```bash
npm install
npm run dev
```

## Card Scraper + Google Sheets Sync

Use the Python utility in `scripts/scrape_card_to_sheet.py` to:

1. Scrape card data from a source URL
2. Append to Google Sheets
3. Generate a card HTML file

Install Python dependencies:

```bash
pip install -r requirements-scraper.txt
```

Example (scrape + generate only):

```bash
python3 scripts/scrape_card_to_sheet.py \
	--url "https://example.com/hdfc-regalia" \
	--bank "HDFC" \
	--skip-sheet
```

Example (scrape + append to sheet + generate HTML):

```bash
python3 scripts/scrape_card_to_sheet.py \
	--url "https://example.com/hdfc-regalia" \
	--bank "HDFC" \
	--service-account-file "/absolute/path/service-account.json" \
	--sheet-name "Credit Cards Sheet" \
	--worksheet-name "Sheet1"
```

Useful selector flags:

- `--title-selector`
- `--fee-selector`
- `--benefit-selector`

## License

MIT
