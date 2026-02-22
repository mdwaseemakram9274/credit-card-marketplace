import { ui } from './theme';
import { landingContent } from './content';

export function HeroSection() {
  const { hero } = landingContent;

  return (
    <section className="py-28 lg:py-36">
      <div className={ui.container}>
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">{hero.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{hero.description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={hero.primaryCta.href} className={ui.primaryButton}>
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className={ui.secondaryButton}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
