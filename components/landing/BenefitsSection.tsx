import { ui } from './theme';
import { landingContent } from './content';

export function BenefitsSection() {
  const { benefits } = landingContent;

  return (
    <section id="benefits" className={`${ui.section} pt-0`}>
      <div className={ui.container}>
        <h2 className={ui.heading}>{benefits.title}</h2>
        <p className={ui.subheading}>{benefits.subtitle}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((item) => (
            <article key={item.title} className="rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 ease-out hover:border-neutral-300">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-black">
                <span className="text-sm font-semibold">•</span>
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
