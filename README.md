# Credit Card Marketplace

SEO-focused credit card marketplace with a dynamic static HTML flow:

**Latest Deployment:** 2025-03-07 - TypeScript compilation fixes applied

- Home: `index.html` / `/`
- Bank list page: `/bank.html?bank=hdfc`
- Card detail page: `/card.html?bank=hdfc&card=millennia-credit-card`

## Local Development

```bash
npm install
npm run dev
```

## Supabase Cloud Storage (Recommended)

This project supports cloud-backed marketplace reads and a standalone admin panel.

### 1) Create Supabase resources

- Run SQL in [supabase/schema.sql](supabase/schema.sql) in your Supabase SQL editor.
- Create a storage bucket named `card-images`.
- (Recommended) Make bucket public for direct image URLs.

### 2) Add environment variables

Copy [`.env.example`](.env.example) to `.env.local` and set values:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
```

### 3) Runtime behavior

- `GET /api/marketplace-data`
	- Reads from Supabase first
	- Falls back to local `public/data/marketplace-data.js` if cloud is not configured/empty

`public/bank.html` and `public/card.html` fetch `/api/marketplace-data` to render marketplace data.

`admin.html` is a standalone localStorage-based admin panel and does not use server-side scraping or OCR.

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

Example (auto-register into marketplace data + output under `public/cards`):

```bash
python3 scripts/scrape_card_to_sheet.py \
	--url "https://example.com/hdfc-regalia" \
	--bank "HDFC" \
	--skip-sheet \
	--update-marketplace-data
```
```

Useful selector flags:

- `--title-selector`
- `--fee-selector`
- `--benefit-selector`

Useful output/data flags:

- `--output-dir` (default: `public/cards`)
- `--bank-slug` (optional override)
- `--update-marketplace-data`
- `--marketplace-data-file` (default: `data/marketplace-data.js`)
- `--public-marketplace-data-file` (default: `public/data/marketplace-data.js`)

## License

MIT
