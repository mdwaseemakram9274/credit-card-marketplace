import { ui } from './theme';

type TrustStatsSectionProps = {
  totalCards: number;
  totalBanks: number;
};

export function TrustStatsSection({ totalCards, totalBanks }: TrustStatsSectionProps) {
  const compact = (value: number) =>
    new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

  const metrics = [
    { label: 'Live Card Offers', value: `${compact(totalCards || 0)}+` },
    { label: 'Partner Banks', value: `${compact(totalBanks || 0)}+` },
    { label: 'Users Guided', value: '250K+' },
    { label: 'Offer Accuracy', value: '99.2%' },
  ];

  return (
    <section className="border-y border-neutral-200 py-10">
      <div className={`${ui.container} grid grid-cols-2 gap-8 md:grid-cols-4`}>
        {metrics.map((metric) => (
          <article key={metric.label} className="space-y-1">
            <p className="text-3xl font-semibold tracking-[-0.02em] text-black">{metric.value}</p>
            <p className="text-sm text-neutral-500">{metric.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
