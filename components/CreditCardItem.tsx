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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 text-neutral-700"
    >
      <path
        d="M5 10.5L8.2 13.5L15 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      className="rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-200 ease-out hover:-translate-y-[2px]"
      aria-label={`${name} credit card listing`}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr_220px] lg:items-center">
        <div className="flex flex-col items-start gap-4">
          <img
            src={image}
            alt={`${name} card image`}
            className="h-auto w-full max-w-[160px] rounded-xl border border-neutral-200 object-contain"
          />

          {showCompare ? (
            <div className="flex items-center gap-2">
              <input
                id={compareId}
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              />
              <label htmlFor={compareId} className="text-sm text-neutral-700">
                Compare
              </label>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-black md:text-2xl">{name}</h3>

          {tags && tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <ul className="mt-5 space-y-2">
            {featureList.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700 md:text-base">
                <span className="mt-0.5 shrink-0">
                  <CheckIcon />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-2 text-sm text-neutral-700">
            <p>
              <span className="font-medium text-neutral-900">Joining Fee:</span> {joiningFee}
            </p>
            <p>
              <span className="font-medium text-neutral-900">Annual/Renewal Fee:</span> {annualFee}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 lg:items-end lg:justify-center">
          <button
            type="button"
            onClick={onCheckEligibility}
            className="w-full rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:w-auto"
          >
            Check Eligibility →
          </button>

          <button
            type="button"
            onClick={onReadMore}
            className="text-left text-sm text-neutral-700 transition-all duration-200 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:text-right"
          >
            Read More
          </button>
        </div>
      </div>
    </article>
  );
}
