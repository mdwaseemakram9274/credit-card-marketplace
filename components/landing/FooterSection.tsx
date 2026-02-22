import { ui } from './theme';

export function FooterSection() {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-white">
      <div className={`${ui.container} grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5`}>
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-black">CreditCardMarket</h3>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            A trust-first financial marketplace for comparing credit card offers with transparency and clarity.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-400">
            Disclaimer: Card approval, credit limits, and final terms are solely determined by issuing banks.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[-0.02em] text-black">Cards</h4>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#offers">
              All Offers
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#offers">
              Rewards Cards
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#offers">
              Cashback Cards
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[-0.02em] text-black">Resources</h4>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#faq">
              FAQs
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#blog">
              Education
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="/admin.html">
              Admin
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[-0.02em] text-black">Legal</h4>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#">
              Terms
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#">
              Privacy
            </a>
            <a className="block transition-all duration-200 ease-out hover:text-black" href="#">
              Compliance
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className={`${ui.container} flex flex-col gap-3 py-6 text-xs text-neutral-400 md:flex-row md:items-center md:justify-between`}>
          <p>© 2026 CreditCardMarket. All rights reserved.</p>
          <p>RBI-aligned disclosure norms • High-trust financial communication standards</p>
        </div>
      </div>
    </footer>
  );
}
