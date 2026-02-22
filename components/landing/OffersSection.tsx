import { FeaturedCard } from './types';
import { ui } from './theme';
import { landingContent } from './content';
import CreditCardItem from '../CreditCardItem';

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

        <div className="mt-10 flex flex-col gap-6">
          {featuredCards.length ? (
            featuredCards.map((card) => (
              <CreditCardItem
                key={`${card.bankSlug}-${card.slug}`}
                name={card.name}
                image={
                  card.imageUrl ||
                  `https://via.placeholder.com/640x420/ffffff/000000?text=${encodeURIComponent(card.name)}`
                }
                features={
                  card.description
                    ? [card.description]
                    : [
                        'Verified issuer information',
                        'Transparent fee details',
                        'Suitable for premium comparison',
                      ]
                }
                joiningFee={offers.unknownFee}
                annualFee={card.annualFee || offers.unknownFee}
                tags={[card.bankName]}
                showCompare
                onCheckEligibility={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/card.html?bank=${encodeURIComponent(card.bankSlug)}&card=${encodeURIComponent(card.slug)}`;
                  }
                }}
                onReadMore={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/card.html?bank=${encodeURIComponent(card.bankSlug)}&card=${encodeURIComponent(card.slug)}`;
                  }
                }}
              />
            ))
          ) : (
            <article className={ui.card}>
              <p className="text-sm text-neutral-500">{offers.emptyState}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
