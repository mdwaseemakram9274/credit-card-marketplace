import { ui } from './theme';

export function AppDownloadSection() {
  return (
    <section className="py-24 pt-0 lg:py-28 lg:pt-0">
      <div className={ui.container}>
        <article className="rounded-xl border border-neutral-200 bg-white p-8 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-black">Get the CreditCardMarket App</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            Track your shortlisted offers and apply from mobile with the same trust-led experience.
          </p>
          <div className="mt-8">
            <a href="#" className={ui.primaryButton}>
              Download App
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
