import { ui } from './theme';

const benefits = [
  {
    title: 'Transparent Comparison',
    description: 'All major fee and value details are visible before you apply.',
  },
  {
    title: 'Eligibility Clarity',
    description: 'Understand likely fit before hitting issuer application forms.',
  },
  {
    title: 'Trust-led Curation',
    description: 'Only serious, active card offers are presented to users.',
  },
  {
    title: 'Offer Monitoring',
    description: 'Updated listings for changing fee and benefits structures.',
  },
  {
    title: 'Secure Experience',
    description: 'No noisy distractions, only high-contrast financial information.',
  },
  {
    title: 'Education First',
    description: 'Learn terms and implications before making card decisions.',
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className={`${ui.section} pt-0`}>
      <div className={ui.container}>
        <h2 className={ui.heading}>Why High-Intent Users Prefer This</h2>
        <p className={ui.subheading}>Designed to feel like premium software with bank-grade seriousness.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
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
