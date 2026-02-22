import { FeaturedCard } from './types';
import { ui } from './theme';
import { landingContent } from './content';

type OffersSectionProps = {
  featuredCards: FeaturedCard[];
};

export function OffersSection({ featuredCards }: OffersSectionProps) {
  const { offers } = landingContent;

  return (
    <section id="offers" className={ui.section}>
      <div className={ui.container}>
        <h2 className={ui.heading}>{offers.title}</h2>
        <p className={ui.subheading}>{offers.subtitle}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredCards.length ? (
            featuredCards.map((card) => (
              <article key={`${card.bankSlug}-${card.slug}`} className={ui.card}>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-black">{card.name}</h3>
                <p className="mt-2 text-sm text-neutral-500">{card.bankName}</p>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {card.description || offers.fallbackDescription}
                </p>
                <div className="my-5 border-t border-neutral-200" />
                <p className="text-sm text-neutral-500">
                  {offers.feeLabel} <span className="text-black">{card.annualFee || offers.unknownFee}</span>
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <a
                    href={`/card.html?bank=${encodeURIComponent(card.bankSlug)}&card=${encodeURIComponent(card.slug)}`}
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-out hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    {offers.primaryCta}
                  </a>
                  <a
                    href={`/card.html?bank=${encodeURIComponent(card.bankSlug)}&card=${encodeURIComponent(card.slug)}`}
                    className="text-sm font-medium text-neutral-600 transition-all duration-200 ease-out hover:text-black"
                  >
                    {offers.secondaryCta}
                  </a>
                </div>
              </article>
            ))
          ) : (
            <article className={`${ui.card} md:col-span-2 xl:col-span-3`}>
              <p className="text-sm text-neutral-500">{offers.emptyState}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
