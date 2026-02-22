import { ui } from './theme';
import { landingContent } from './content';

export function FAQSection() {
  const { faq } = landingContent;

  return (
    <section id="faq" className={`${ui.section} pt-0`}>
      <div className="mx-auto w-full max-w-3xl px-6 lg:px-10">
        <h2 className={ui.heading}>{faq.title}</h2>
        <p className={ui.subheading}>{faq.subtitle}</p>

        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {faq.items.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="cursor-pointer list-none text-base font-medium text-black transition-all duration-200 ease-out group-hover:text-neutral-700">
                <div className="flex items-center justify-between gap-4">
                  <span>{item.question}</span>
                  <span className="text-neutral-400 transition-transform duration-200 ease-out group-open:rotate-45">+</span>
                </div>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
