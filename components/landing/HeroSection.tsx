import { ui } from './theme';

export function HeroSection() {
  return (
    <section className="py-28 lg:py-36">
      <div className={ui.container}>
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">Bank-grade card recommendations</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-6xl lg:text-7xl">
            Better credit card decisions for financially serious users.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Compare verified card offers, understand fee structures, and apply with confidence on a platform built for trust, not noise.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#offers" className={ui.primaryButton}>
              Check Eligibility
            </a>
            <a href="#partners" className={ui.secondaryButton}>
              View Partner Banks
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
