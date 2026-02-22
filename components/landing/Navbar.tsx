import { MarketplaceBank } from './types';
import { ui } from './theme';
import { landingContent } from './content';

type NavbarProps = {
  banks: MarketplaceBank[];
  isLoading: boolean;
};

export function Navbar({ banks, isLoading }: NavbarProps) {
  const { navbar } = landingContent;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className={`${ui.container} flex h-20 items-center justify-between gap-4`}>
        <a href="/" className="text-xl font-semibold tracking-[-0.02em] text-black">
          {navbar.brand}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navbar.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-all duration-200 ease-out hover:text-black"
            >
              {link.label}
            </a>
          ))}
          <div className="group relative">
            <button className="text-sm font-medium text-neutral-600 transition-all duration-200 ease-out group-hover:text-black">
              {navbar.banksMenuLabel}
            </button>
            <div className="invisible absolute right-0 top-8 z-20 w-60 rounded-lg border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {isLoading ? (
                <p className="px-2 py-1 text-sm text-neutral-400">{navbar.loadingBanks}</p>
              ) : banks.length ? (
                banks.slice(0, 10).map((bank) => (
                  <a
                    key={bank.slug}
                    href={`/bank.html?bank=${encodeURIComponent(bank.slug)}`}
                    className="block rounded-md px-2 py-2 text-sm text-neutral-600 transition-all duration-200 ease-out hover:bg-neutral-50 hover:text-black"
                  >
                    {bank.name}
                  </a>
                ))
              ) : (
                <p className="px-2 py-1 text-sm text-neutral-400">{navbar.noBanks}</p>
              )}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={navbar.loginCta.href} className={ui.secondaryButton}>
            {navbar.loginCta.label}
          </a>
          <a href={navbar.primaryCta.href} className={ui.primaryButton}>
            {navbar.primaryCta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
