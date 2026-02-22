import { MarketplaceBank } from './types';
import { ui } from './theme';

type PartnersSectionProps = {
  banks: MarketplaceBank[];
};

export function PartnersSection({ banks }: PartnersSectionProps) {
  const partners = banks.slice(0, 12);

  return (
    <section id="partners" className={`${ui.section} pt-0`}>
      <div className={ui.container}>
        <h2 className={ui.heading}>Trusted Bank Partners</h2>
        <p className={ui.subheading}>Issuer relationships built for compliance, clarity, and long-term trust.</p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {partners.length
            ? partners.map((bank) => (
                <a
                  key={bank.slug}
                  href={`/bank.html?bank=${encodeURIComponent(bank.slug)}`}
                  className="flex h-16 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-500 transition-all duration-200 ease-out hover:border-neutral-300 hover:text-black"
                >
                  {bank.name}
                </a>
              ))
            : ['HDFC', 'SBI', 'Axis', 'ICICI', 'Kotak', 'IDFC'].map((name) => (
                <article
                  key={name}
                  className="flex h-16 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-500"
                >
                  {name}
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
