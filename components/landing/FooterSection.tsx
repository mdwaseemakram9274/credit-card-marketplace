import { ui } from './theme';
import { landingContent } from './content';

export function FooterSection() {
  const { footer } = landingContent;

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-white">
      <div className={`${ui.container} grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5`}>
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-black">{footer.brand}</h3>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">{footer.description}</p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-400">{footer.disclaimer}</p>
        </div>

        {footer.columns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold tracking-[-0.02em] text-black">{column.title}</h4>
            <div className="mt-4 space-y-3 text-sm text-neutral-600">
              {column.links.map((link) => (
                <a
                  key={link.label}
                  className="block transition-all duration-200 ease-out hover:text-black"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200">
        <div className={`${ui.container} flex flex-col gap-3 py-6 text-xs text-neutral-400 md:flex-row md:items-center md:justify-between`}>
          <p>{footer.copyright}</p>
          <p>{footer.complianceLine}</p>
        </div>
      </div>
    </footer>
  );
}
