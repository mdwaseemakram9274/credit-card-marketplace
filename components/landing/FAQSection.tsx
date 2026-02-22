import { ui } from './theme';

const faqItems = [
  {
    question: 'Does checking eligibility affect my credit score?',
    answer: 'No. Eligibility checks shown here are informational and do not reduce your bureau score.',
  },
  {
    question: 'How often are offers updated?',
    answer: 'Cards and offer details are refreshed regularly, but final terms are always issuer controlled.',
  },
  {
    question: 'Can I compare multiple cards at once?',
    answer: 'Yes. Compare fee, issuer, and key offer value directly before choosing your next step.',
  },
  {
    question: 'Are these card approvals guaranteed?',
    answer: 'No. Final approval depends on each bank’s risk and policy checks.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className={`${ui.section} pt-0`}>
      <div className="mx-auto w-full max-w-3xl px-6 lg:px-10">
        <h2 className={ui.heading}>Frequently Asked Questions</h2>
        <p className={ui.subheading}>Clear answers for trust-sensitive financial decisions.</p>

        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {faqItems.map((item) => (
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
