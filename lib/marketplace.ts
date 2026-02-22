import fs from 'fs';
import path from 'path';
import vm from 'vm';

export type CardEntry = {
  title: string;
  filename: string;
  imageUrl?: string;
  annualFee?: string;
  description?: string;
  keyBenefits?: string[];
};

export type MarketplaceData = {
  banks: Record<
    string,
    {
      name: string;
      cards: CardEntry[];
    }
  >;
};

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function parseMarketplaceData(fileContent: string): MarketplaceData {
  const sandbox: { window: { marketplaceData?: MarketplaceData } } = { window: {} };
  vm.runInNewContext(fileContent, sandbox);

  if (!sandbox.window.marketplaceData || !sandbox.window.marketplaceData.banks) {
    throw new Error('Invalid marketplace data format.');
  }

  return sandbox.window.marketplaceData;
}

export function serializeMarketplaceData(data: MarketplaceData): string {
  return `window.marketplaceData = ${JSON.stringify(data, null, 2)};\n`;
}

export function upsertBankAndCard(params: {
  data: MarketplaceData;
  bankSlug: string;
  bankName: string;
  card: CardEntry;
}): void {
  const { data, bankSlug, bankName, card } = params;

  if (!data.banks[bankSlug]) {
    data.banks[bankSlug] = {
      name: bankName,
      cards: [],
    };
  }

  const cards = data.banks[bankSlug].cards;
  const existingIndex = cards.findIndex((entry) => entry.filename === card.filename);

  if (existingIndex >= 0) {
    cards[existingIndex] = {
      ...cards[existingIndex],
      ...card,
    };
  } else {
    cards.push(card);
  }
}

export function loadMarketplaceFile(filePath: string): MarketplaceData {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseMarketplaceData(content);
}

export function saveMarketplaceFile(filePath: string, data: MarketplaceData): void {
  const content = serializeMarketplaceData(data);
  fs.writeFileSync(filePath, content, 'utf8');
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function createCardHtml(params: {
  bankName: string;
  cardName: string;
  sourceUrl: string;
  imageUrl?: string;
  annualFee?: string;
  description?: string;
  keyBenefits?: string[];
}): string {
  const { bankName, cardName, sourceUrl, imageUrl, annualFee, description, keyBenefits } = params;

  const benefitsHtml = (keyBenefits || [])
    .slice(0, 8)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(cardName)} | ${escapeHtml(bankName)}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">Card Insider</a>
      <a class="btn btn-outline-secondary btn-sm" href="/bank.html?bank=${encodeURIComponent(toSlug(bankName))}">Back to Bank</a>
    </div>
  </nav>

  <main class="container py-5">
    <div class="card shadow-sm border-0">
      <div class="card-body p-4 p-md-5">
        <p class="text-uppercase text-muted small mb-2">${escapeHtml(bankName)}</p>
        <h1 class="h3 mb-3">${escapeHtml(cardName)}</h1>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(cardName)}" class="img-fluid rounded border mb-3" style="max-height:240px;object-fit:contain;">` : ''}
        <p class="mb-2"><strong>Annual fee:</strong> ${escapeHtml(annualFee || 'Not available')}</p>
        <p class="text-secondary">${escapeHtml(description || 'Details will be updated soon.')}</p>
        ${benefitsHtml ? `<h2 class="h5 mt-4">Key benefits</h2><ul>${benefitsHtml}</ul>` : ''}
        <a class="btn btn-primary mt-3" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Official Source</a>
      </div>
    </div>
  </main>
</body>
</html>
`;
}

export function marketplacePaths(rootDir: string): string[] {
  return [
    path.join(rootDir, 'data', 'marketplace-data.js'),
    path.join(rootDir, 'public', 'data', 'marketplace-data.js'),
  ];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
