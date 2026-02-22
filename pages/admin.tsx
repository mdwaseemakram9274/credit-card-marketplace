import { FormEvent, useMemo, useState } from 'react';
import Head from 'next/head';

type Result = {
  ok: boolean;
  error?: string;
  persisted?: boolean;
  warnings?: string[];
  bankSlug?: string;
  cardSlug?: string;
  annualFee?: string | null;
  keyBenefits?: string[];
  bankPageUrl?: string;
  cardQueryUrl?: string;
  generatedCardUrl?: string;
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export default function AdminScrapePage() {
  const [bankName, setBankName] = useState('');
  const [cardName, setCardName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [coBrandedMode, setCoBrandedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const bankSlug = useMemo(() => toSlug(bankName || cardName), [bankName, cardName]);
  const cardSlug = useMemo(() => toSlug(cardName), [cardName]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setResult(null);

    const resolvedBank = (coBrandedMode ? cardName : bankName).trim();
    const resolvedCard = cardName.trim();

    if (!resolvedBank || !resolvedCard || !sourceUrl.trim()) {
      setResult({ ok: false, error: 'Bank name, card name, and source URL are required.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/scrape-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: resolvedBank,
          cardName: resolvedCard,
          sourceUrl: sourceUrl.trim(),
          description: description.trim(),
          bankSlug: toSlug(resolvedBank),
          cardSlug: toSlug(resolvedCard),
        }),
      });

      const payload = (await response.json()) as Result;
      setResult(payload);
    } catch {
      setResult({ ok: false, error: 'Failed to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin | Add & Scrape Card</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="container py-5" style={{ maxWidth: 760 }}>
        <div className="mb-4">
          <h1 className="h3 mb-2">Add & Scrape Card</h1>
          <p className="text-muted mb-0">
            Add bank name, card name, and source URL. Missing bank/card entries are created automatically.
          </p>
        </div>

        <form className="card border-0 shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body p-4">
          <div className="form-check mb-3">
            <input
              id="coBrandedMode"
              className="form-check-input"
              type="checkbox"
              checked={coBrandedMode}
              onChange={(e) => setCoBrandedMode(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="coBrandedMode">
              Co-branded/single-card brand (use card name as bank name)
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="bankName">
              Bank Name
            </label>
            <input
              id="bankName"
              className="form-control"
              value={coBrandedMode ? cardName : bankName}
              onChange={(e) => setBankName(e.target.value)}
              disabled={coBrandedMode}
              placeholder="e.g. HDFC Bank"
              required={!coBrandedMode}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cardName">
              Card Name
            </label>
            <input
              id="cardName"
              className="form-control"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="e.g. Millennia Credit Card"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="sourceUrl">
              Source URL
            </label>
            <input
              id="sourceUrl"
              type="url"
              className="form-control"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://www.example.com/card-details"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Description (optional override)
            </label>
            <textarea
              id="description"
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional custom description"
            />
          </div>

          <div className="row g-2 mb-4 text-muted small">
            <div className="col-md-6">
              <strong>Bank Slug:</strong> {bankSlug || '-'}
            </div>
            <div className="col-md-6">
              <strong>Card Slug:</strong> {cardSlug || '-'}
            </div>
          </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Scraping...' : 'Scrape and Save'}
            </button>
          </div>
        </form>

        {result && (
          <div className={`alert mt-4 ${result.ok ? 'alert-success' : 'alert-danger'}`}>
            {result.ok ? (
              <>
                <div className="fw-semibold mb-2">Card saved successfully.</div>
                {result.persisted === false && (
                  <div className="small mb-2">
                    Running in read-only environment (like Vercel runtime). Scrape succeeded, but files were not persisted.
                  </div>
                )}
                {Array.isArray(result.warnings) && result.warnings.length > 0 && (
                  <ul className="small mb-2">
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                )}
                <div className="small mb-2">Annual fee: {result.annualFee || 'Not found'}</div>
                <div className="d-flex flex-wrap gap-2">
                  {result.bankPageUrl && (
                    <a className="btn btn-sm btn-outline-primary" href={result.bankPageUrl} target="_blank" rel="noreferrer">
                      Open Bank Page
                    </a>
                  )}
                  {result.cardQueryUrl && (
                    <a className="btn btn-sm btn-outline-primary" href={result.cardQueryUrl} target="_blank" rel="noreferrer">
                      Open Card Query Page
                    </a>
                  )}
                  {result.generatedCardUrl && (
                    <a className="btn btn-sm btn-outline-primary" href={result.generatedCardUrl} target="_blank" rel="noreferrer">
                      Open Generated Card Page
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>{result.error || 'Something went wrong.'}</>
            )}
          </div>
        )}
      </div>
    </>
  );
}
