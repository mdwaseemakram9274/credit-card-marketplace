import { ui } from './theme';

const posts = [
  {
    title: 'How to evaluate annual fee vs value',
    excerpt: 'A practical approach for high-spend and low-spend profiles.',
  },
  {
    title: 'Rewards, miles, or cashback: what fits best?',
    excerpt: 'Use-case driven breakdown for selecting your card strategy.',
  },
  {
    title: 'Before you apply: 7 financial checks',
    excerpt: 'Reduce surprises by verifying eligibility and repayment readiness.',
  },
];

export function BlogSection() {
  return (
    <section id="blog" className={`${ui.section} pt-0`}>
      <div className={ui.container}>
        <h2 className={ui.heading}>Financial Education</h2>
        <p className={ui.subheading}>Knowledge-first content for better borrowing and rewards decisions.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className={ui.card}>
              <p className="text-xs uppercase tracking-[0.1em] text-neutral-400">Insights</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-black">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
