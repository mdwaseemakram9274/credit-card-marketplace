import { ui } from './theme';
import { landingContent } from './content';

export function BlogSection() {
  const { blog } = landingContent;

  return (
    <section id="blog" className={`${ui.section} pt-0`}>
      <div className={ui.container}>
        <h2 className={ui.heading}>{blog.title}</h2>
        <p className={ui.subheading}>{blog.subtitle}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blog.posts.map((post) => (
            <article key={post.title} className={ui.card}>
              <p className="text-xs uppercase tracking-[0.1em] text-neutral-400">{blog.badge}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-black">{post.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
