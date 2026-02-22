import React, { useId } from 'react';

export interface CreditCardItemProps {
  name: string;
  image: string;
  features: string[];
  joiningFee: string;
  annualFee: string;
  tags?: string[];
  onCheckEligibility?: () => void;
  onReadMore?: () => void;
  showCompare?: boolean;
}

function FeatureIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5 text-black"
    >
      <path
        d="M6 10.2L9 13.1L14 7.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function CreditCardItem({
  name,
  image,
  features,
  joiningFee,
  annualFee,
  tags,
  onCheckEligibility,
  onReadMore,
  showCompare = false,
}: CreditCardItemProps) {
  const compareId = useId();
  const featureList = features.slice(0, 5);

  return (
    <article
      className="rounded-2xl border border-neutral-200 bg-white transition-all duration-200 ease-out hover:-translate-y-[2px]"
      aria-label={`${name} credit card listing`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px]">
        <div className="flex flex-col justify-between gap-8 rounded-t-2xl bg-neutral-50 p-6 lg:rounded-l-2xl lg:rounded-tr-none">
          <img
            src={image}
            alt={`${name} card image`}
            className="h-auto w-full max-w-[160px] rounded-xl border border-neutral-200 bg-white object-contain"
          />

          {showCompare ? (
            <div className="flex items-center gap-3">
              <input
                id={compareId}
                type="checkbox"
                className="h-7 w-7 rounded-md border-neutral-400 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              />
              <label htmlFor={compareId} className="text-lg font-medium text-black md:text-2xl">
                Compare
              </label>
            </div>
          ) : null}
        </div>

        <div className="p-6 lg:p-8">
          <h3 className="text-2xl font-semibold text-black">{name}</h3>

          <ul className="mt-6 space-y-3">
            {featureList.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-xl text-neutral-800">
                <span className="mt-0.5 shrink-0">
                  <FeatureIcon />
                </span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 space-y-2 text-xl text-neutral-800">
            <p>
              <span className="font-medium text-neutral-800">Joining Fee:</span>{' '}
              <span className="font-semibold text-black">{joiningFee}</span>
            </p>
            <p>
              <span className="font-medium text-neutral-800">Annual/Renewal Fee:</span>{' '}
              <span className="font-semibold text-black">{annualFee}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 lg:items-end lg:rounded-r-2xl lg:p-8">
          {tags && tags.length > 0 ? (
            <div className="flex w-full flex-wrap gap-2 lg:justify-end">
              {tags.map((tag) => (
                <span key={tag} className="rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-2 text-lg text-black">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}

          <div className="flex w-full flex-col gap-4 lg:items-end">
            <button
              type="button"
              onClick={onCheckEligibility}
              className="w-full rounded-lg bg-black px-6 py-3 text-lg font-medium text-white transition-all duration-200 ease-out hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:w-auto"
            >
              Check Eligibility →
            </button>

            <button
              type="button"
              onClick={onReadMore}
              className="text-left text-2xl font-medium text-neutral-800 transition-all duration-200 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:text-right"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
