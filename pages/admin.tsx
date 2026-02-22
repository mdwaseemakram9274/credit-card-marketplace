import { FormEvent, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

type Result = {
  ok: boolean;
  error?: string;
  persisted?: boolean;
  writeTarget?: 'cloud' | 'local';
  warnings?: string[];
  bankSlug?: string;
  cardSlug?: string;
  imageUrl?: string | null;
  imageCandidates?: string[];
  annualFee?: string | null;
  keyBenefits?: string[];
  bankPageUrl?: string;
  cardQueryUrl?: string;
  generatedCardUrl?: string;
};

type AutoFillResponse = {
  ok: boolean;
  mappedFields?: Partial<{
    benefitTags: string;
    primaryCardType: string;
    joiningFee: string;
    annualFeeInput: string;
    foreignMarkup: string;
    minAge: string;
    minIncome: string;
    applicationUrl: string;
    baseRewardRule: string;
    redemptionOptions: string;
    keyTerms: string;
  }>;
  usedSources?: {
    url: boolean;
    image: boolean;
  };
  missingRequired?: string[];
  error?: string;
};

type AdminStatus = {
  mode: 'cloud' | 'local';
  configured: boolean;
  connected: boolean;
  message: string;
};

type ValidationState = {
  errors: string[];
  warnings: string[];
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [useScrapedImage, setUseScrapedImage] = useState(true);
  const [coBrandedMode, setCoBrandedMode] = useState(false);
  const [benefitTags, setBenefitTags] = useState('');
  const [primaryCardType, setPrimaryCardType] = useState('');
  const [joiningFee, setJoiningFee] = useState('');
  const [annualFeeInput, setAnnualFeeInput] = useState('');
  const [foreignMarkup, setForeignMarkup] = useState('');
  const [minAge, setMinAge] = useState('');
  const [minIncome, setMinIncome] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [baseRewardRule, setBaseRewardRule] = useState('');
  const [redemptionOptions, setRedemptionOptions] = useState('');
  const [keyTerms, setKeyTerms] = useState('');
  const [publishStatus, setPublishStatus] = useState<'draft' | 'review' | 'published'>('draft');
  const [sourceType, setSourceType] = useState<'url' | 'image' | 'manual' | 'llm'>('url');
  const [lastVerifiedDate, setLastVerifiedDate] = useState('');

  const [welcomeBonus, setWelcomeBonus] = useState('');
  const [travelBenefits, setTravelBenefits] = useState('');
  const [fuelBenefits, setFuelBenefits] = useState('');
  const [shoppingBenefits, setShoppingBenefits] = useState('');
  const [renewalWaiver, setRenewalWaiver] = useState('');
  const [rewardCaps, setRewardCaps] = useState('');
  const [redemptionValue, setRedemptionValue] = useState('');
  const [creditLimitRange, setCreditLimitRange] = useState('');

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [validation, setValidation] = useState<ValidationState>({ errors: [], warnings: [] });
  const [autoFillMessage, setAutoFillMessage] = useState('');

  const bankSlug = useMemo(() => toSlug(bankName || cardName), [bankName, cardName]);
  const cardSlug = useMemo(() => toSlug(cardName), [cardName]);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch('/api/admin/status');
        const payload = (await response.json()) as AdminStatus;
        setStatus(payload);
      } catch {
        setStatus({
          mode: 'local',
          configured: false,
          connected: false,
          message: 'Unable to check cloud connection. Assuming local fallback.',
        });
      }
    };

    loadStatus();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setResult(null);

    const resolvedBank = (coBrandedMode ? cardName : bankName).trim();
    const resolvedCard = cardName.trim();

    if (!resolvedBank || !resolvedCard || !sourceUrl.trim()) {
      setResult({ ok: false, error: 'Bank name, card name, and source URL are required.' });
      return;
    }

    const validationResult = validateCategoryMapping({
      benefitTags,
      primaryCardType,
      joiningFee,
      annualFeeInput,
      foreignMarkup,
      minAge,
      minIncome,
      applicationUrl,
      baseRewardRule,
      redemptionOptions,
      keyTerms,
      publishStatus,
      sourceType,
      lastVerifiedDate,
      hasImage: Boolean(uploadedImage) || useScrapedImage,
      optionalFields: {
        welcomeBonus,
        travelBenefits,
        fuelBenefits,
        shoppingBenefits,
        renewalWaiver,
        rewardCaps,
        redemptionValue,
        creditLimitRange,
      },
    });

    setValidation(validationResult);
    if (validationResult.errors.length > 0) {
      setResult({ ok: false, error: 'Please fill all required mapped fields before saving.' });
      return;
    }

    setLoading(true);

    try {
      const uploadedImageData = uploadedImage ? await fileToDataUrl(uploadedImage) : undefined;

      const response = await fetch('/api/admin/scrape-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: resolvedBank,
          cardName: resolvedCard,
          sourceUrl: sourceUrl.trim(),
          description: description.trim(),
          annualFeeOverride: annualFeeInput.trim(),
          uploadedImageData,
          uploadedImageName: uploadedImage?.name,
          useScrapedImage,
          bankSlug: toSlug(resolvedBank),
          cardSlug: toSlug(resolvedCard),
          taxonomy: {
            featuresAndBenefits: {
              benefitTags,
              welcomeBonus,
              travelBenefits,
              fuelBenefits,
              shoppingBenefits,
            },
            cardTypeAndPositioning: {
              primaryCardType,
            },
            feesAndCharges: {
              joiningFee,
              annualFee: annualFeeInput,
              foreignMarkup,
              renewalWaiver,
            },
            eligibilityAndApplication: {
              minAge,
              minIncome,
              applicationUrl,
            },
            rewardsEarningRules: {
              baseRewardRule,
              rewardCaps,
            },
            redemptionAndValue: {
              redemptionOptions,
              redemptionValue,
            },
            limitsAndTerms: {
              keyTerms,
              creditLimitRange,
            },
            metadataAndGovernance: {
              publishStatus,
              sourceType,
              lastVerifiedDate,
            },
          },
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

  const handleAutoFillMappedFields = async () => {
    setAutoFillMessage('');
    setResult(null);
    setValidation({ errors: [], warnings: [] });

    if (!sourceUrl.trim() && !uploadedImage) {
      setAutoFillMessage('Provide source URL or upload image for extraction.');
      return;
    }

    setExtracting(true);
    try {
      const uploadedImageData = uploadedImage ? await fileToDataUrl(uploadedImage) : undefined;

      const response = await fetch('/api/admin/extract-mapped-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: sourceUrl.trim(),
          uploadedImageData,
        }),
      });

      const payload = (await response.json()) as AutoFillResponse;
      if (!payload.ok || !payload.mappedFields) {
        setAutoFillMessage(payload.error || 'Unable to auto-fill fields.');
        return;
      }

      setBenefitTags(payload.mappedFields.benefitTags || benefitTags);
      setPrimaryCardType(payload.mappedFields.primaryCardType || primaryCardType);
      setJoiningFee(payload.mappedFields.joiningFee || joiningFee);
      setAnnualFeeInput(payload.mappedFields.annualFeeInput || annualFeeInput);
      setForeignMarkup(payload.mappedFields.foreignMarkup || foreignMarkup);
      setMinAge(payload.mappedFields.minAge || minAge);
      setMinIncome(payload.mappedFields.minIncome || minIncome);
      setApplicationUrl(payload.mappedFields.applicationUrl || applicationUrl || sourceUrl.trim());
      setBaseRewardRule(payload.mappedFields.baseRewardRule || baseRewardRule);
      setRedemptionOptions(payload.mappedFields.redemptionOptions || redemptionOptions);
      setKeyTerms(payload.mappedFields.keyTerms || keyTerms);

      const used = payload.usedSources || { url: false, image: false };
      setAutoFillMessage(
        `Mapped fields auto-filled. Source used: ${used.url ? 'URL' : ''}${used.url && used.image ? ' + ' : ''}${used.image ? 'Image OCR' : ''}${!used.url && !used.image ? 'None' : ''}.`
      );
    } catch {
      setAutoFillMessage('Auto-fill failed due to network/server issue.');
    } finally {
      setExtracting(false);
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
          {status && (
            <div className={`mt-2 badge ${status.mode === 'cloud' ? 'text-bg-success' : 'text-bg-warning'}`}>
              {status.mode === 'cloud' ? 'Cloud Connected' : 'Local Fallback'}
            </div>
          )}
          {status && <div className="small text-muted mt-1">{status.message}</div>}
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

          <hr className="my-4" />
          <h2 className="h6">Mapped Fields (Required)</h2>

          <div className="mb-3">
            <label className="form-label" htmlFor="benefitTags">Features & Benefits Tags</label>
            <input
              id="benefitTags"
              className="form-control"
              value={benefitTags}
              onChange={(e) => setBenefitTags(e.target.value)}
              placeholder="e.g. Rewards, Cashback, Travel"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="primaryCardType">Primary Card Type</label>
            <select
              id="primaryCardType"
              className="form-select"
              value={primaryCardType}
              onChange={(e) => setPrimaryCardType(e.target.value)}
            >
              <option value="">Select card type</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="fuel">Fuel</option>
              <option value="cashback">Cashback</option>
              <option value="shopping">Shopping</option>
              <option value="premium">Premium</option>
              <option value="co-branded">Co-branded</option>
              <option value="secured">Secured</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="joiningFee">Joining Fee</label>
              <input id="joiningFee" className="form-control" value={joiningFee} onChange={(e) => setJoiningFee(e.target.value)} placeholder="e.g. ₹999" />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="annualFeeInput">Annual Fee</label>
              <input id="annualFeeInput" className="form-control" value={annualFeeInput} onChange={(e) => setAnnualFeeInput(e.target.value)} placeholder="e.g. ₹999" />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="foreignMarkup">Foreign Markup</label>
              <input id="foreignMarkup" className="form-control" value={foreignMarkup} onChange={(e) => setForeignMarkup(e.target.value)} placeholder="e.g. 3.5%" />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="minAge">Minimum Age</label>
              <input id="minAge" className="form-control" value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="e.g. 21" />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="minIncome">Minimum Income</label>
              <input id="minIncome" className="form-control" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} placeholder="e.g. ₹6L" />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="applicationUrl">Application URL</label>
              <input id="applicationUrl" type="url" className="form-control" value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="baseRewardRule">Base Reward Rule</label>
            <input id="baseRewardRule" className="form-control" value={baseRewardRule} onChange={(e) => setBaseRewardRule(e.target.value)} placeholder="e.g. 1 RP per ₹150" />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="redemptionOptions">Redemption Options</label>
            <input id="redemptionOptions" className="form-control" value={redemptionOptions} onChange={(e) => setRedemptionOptions(e.target.value)} placeholder="e.g. vouchers, statement credit" />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="keyTerms">Key Terms & Conditions</label>
            <textarea id="keyTerms" className="form-control" rows={2} value={keyTerms} onChange={(e) => setKeyTerms(e.target.value)} placeholder="Important terms" />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="publishStatus">Publish Status</label>
              <select id="publishStatus" className="form-select" value={publishStatus} onChange={(e) => setPublishStatus(e.target.value as 'draft' | 'review' | 'published')}>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="sourceType">Source Type</label>
              <select id="sourceType" className="form-select" value={sourceType} onChange={(e) => setSourceType(e.target.value as 'url' | 'image' | 'manual' | 'llm')}>
                <option value="url">URL</option>
                <option value="image">Image</option>
                <option value="manual">Manual</option>
                <option value="llm">LLM</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="lastVerifiedDate">Last Verified Date</label>
              <input id="lastVerifiedDate" type="date" className="form-control" value={lastVerifiedDate} onChange={(e) => setLastVerifiedDate(e.target.value)} />
            </div>
          </div>

          <h3 className="h6 mt-4">Optional Enrichment</h3>
          <div className="row g-3 mb-3">
            <div className="col-md-6"><input className="form-control" value={welcomeBonus} onChange={(e) => setWelcomeBonus(e.target.value)} placeholder="Welcome bonus" /></div>
            <div className="col-md-6"><input className="form-control" value={travelBenefits} onChange={(e) => setTravelBenefits(e.target.value)} placeholder="Travel benefits" /></div>
            <div className="col-md-6"><input className="form-control" value={fuelBenefits} onChange={(e) => setFuelBenefits(e.target.value)} placeholder="Fuel benefits" /></div>
            <div className="col-md-6"><input className="form-control" value={shoppingBenefits} onChange={(e) => setShoppingBenefits(e.target.value)} placeholder="Shopping benefits" /></div>
            <div className="col-md-6"><input className="form-control" value={renewalWaiver} onChange={(e) => setRenewalWaiver(e.target.value)} placeholder="Renewal waiver" /></div>
            <div className="col-md-6"><input className="form-control" value={rewardCaps} onChange={(e) => setRewardCaps(e.target.value)} placeholder="Reward caps" /></div>
            <div className="col-md-6"><input className="form-control" value={redemptionValue} onChange={(e) => setRedemptionValue(e.target.value)} placeholder="Redemption value" /></div>
            <div className="col-md-6"><input className="form-control" value={creditLimitRange} onChange={(e) => setCreditLimitRange(e.target.value)} placeholder="Credit limit range" /></div>
          </div>

          {validation.errors.length > 0 && (
            <div className="alert alert-danger small">
              <div className="fw-semibold mb-1">Required fields missing:</div>
              <ul className="mb-0">
                {validation.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="alert alert-warning small">
              <div className="fw-semibold mb-1">Optional suggestions:</div>
              <ul className="mb-0">
                {validation.warnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-check mb-3">
            <input
              id="useScrapedImage"
              className="form-check-input"
              type="checkbox"
              checked={useScrapedImage}
              onChange={(e) => setUseScrapedImage(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="useScrapedImage">
              Auto-pick image from scraped page
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="uploadedImage">
              Upload Image (optional)
            </label>
            <input
              id="uploadedImage"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
            />
            <div className="form-text">If provided, uploaded image will be used for this card.</div>
          </div>

          <div className="mb-3">
            <button type="button" className="btn btn-outline-primary" disabled={extracting} onClick={handleAutoFillMappedFields}>
              {extracting ? 'Auto Filling...' : 'Auto Fill Mapped Fields (URL → Image)'}
            </button>
            {autoFillMessage && <div className="small mt-2 text-muted">{autoFillMessage}</div>}
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
                <div className="small mb-2">Write target: {result.writeTarget === 'cloud' ? 'Cloud (Supabase)' : 'Local fallback'}</div>
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
                {result.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={result.imageUrl}
                      alt="Scraped card"
                      className="img-fluid rounded border"
                      style={{ maxHeight: 220, objectFit: 'contain' }}
                    />
                  </div>
                )}
                {Array.isArray(result.imageCandidates) && result.imageCandidates.length > 0 && (
                  <div className="small mb-2">
                    Found image candidates:{' '}
                    {result.imageCandidates.slice(0, 3).map((candidate, index) => (
                      <span key={candidate}>
                        <a href={candidate} target="_blank" rel="noreferrer">
                          image {index + 1}
                        </a>
                        {index < Math.min(result.imageCandidates!.length, 3) - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
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

function validateCategoryMapping(params: {
  benefitTags: string;
  primaryCardType: string;
  joiningFee: string;
  annualFeeInput: string;
  foreignMarkup: string;
  minAge: string;
  minIncome: string;
  applicationUrl: string;
  baseRewardRule: string;
  redemptionOptions: string;
  keyTerms: string;
  publishStatus: string;
  sourceType: string;
  lastVerifiedDate: string;
  hasImage: boolean;
  optionalFields: Record<string, string>;
}): ValidationState {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!params.benefitTags.trim()) errors.push('Features & Benefits tags');
  if (!params.primaryCardType.trim()) errors.push('Primary card type');
  if (!params.joiningFee.trim()) errors.push('Joining fee');
  if (!params.annualFeeInput.trim()) errors.push('Annual fee');
  if (!params.foreignMarkup.trim()) errors.push('Foreign markup');
  if (!params.minAge.trim()) errors.push('Minimum age');
  if (!params.minIncome.trim()) errors.push('Minimum income or not-disclosed');
  if (!params.applicationUrl.trim()) errors.push('Application URL');
  if (!params.baseRewardRule.trim()) errors.push('Base reward rule');
  if (!params.redemptionOptions.trim()) errors.push('Redemption options');
  if (!params.keyTerms.trim()) errors.push('Key terms & conditions');
  if (!params.publishStatus.trim()) errors.push('Publish status');
  if (!params.sourceType.trim()) errors.push('Source type');
  if (!params.lastVerifiedDate.trim()) errors.push('Last verified date');
  if (!params.hasImage) errors.push('Card image (upload or scraped)');

  const optionalLabels: Record<string, string> = {
    welcomeBonus: 'Welcome bonus',
    travelBenefits: 'Travel benefits',
    fuelBenefits: 'Fuel benefits',
    shoppingBenefits: 'Shopping benefits',
    renewalWaiver: 'Renewal waiver criteria',
    rewardCaps: 'Reward caps/exclusions',
    redemptionValue: 'Redemption value details',
    creditLimitRange: 'Credit limit range',
  };

  Object.entries(optionalLabels).forEach(([key, label]) => {
    if (!(params.optionalFields[key] || '').trim()) {
      warnings.push(label);
    }
  });

  return { errors, warnings };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(new Error('Unable to read selected file.'));
    reader.readAsDataURL(file);
  });
}
