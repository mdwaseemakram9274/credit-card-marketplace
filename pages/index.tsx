import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

type MarketplaceCard = {
  slug: string
  name: string
  description?: string
  imageUrl?: string
  annualFee?: string
}

type MarketplaceBank = {
  slug: string
  name: string
  description?: string
  cards?: MarketplaceCard[]
}

type MarketplaceResponse = {
  source?: 'cloud' | 'local'
  banks: MarketplaceBank[]
}

type FeaturedCard = MarketplaceCard & {
  bankSlug: string
  bankName: string
}

export default function HomePage() {
  const [banks, setBanks] = useState<MarketplaceBank[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/marketplace-data')
        const payload = (await response.json()) as MarketplaceResponse

        if (response.ok && Array.isArray(payload.banks)) {
          setBanks(payload.banks)
        } else {
          setBanks([])
        }
      } catch {
        setBanks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const banksToShow = useMemo(() => banks.slice(0, 6), [banks])

  const featuredCards = useMemo<FeaturedCard[]>(() => {
    return banks
      .flatMap((bank) =>
        (bank.cards || []).map((card) => ({
          ...card,
          bankSlug: bank.slug,
          bankName: bank.name,
        }))
      )
      .slice(0, 6)
  }, [banks])

  const totalCards = useMemo(
    () => banks.reduce((acc, bank) => acc + (bank.cards?.length || 0), 0),
    [banks]
  )

  const formatCompact = (value: number) => {
    if (!value) return '0'
    return new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)
  }

  const heroImage = featuredCards[0]?.imageUrl || 'https://via.placeholder.com/900x520/1A73E8/ffffff?text=Credit+Card+Marketplace'

  return (
    <>
      <Head>
        <title>CreditCardMarket | Compare & Apply</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Compare and apply for the best credit cards in India with AI-powered recommendations."
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <style jsx global>{`
        :root {
          --primary: #1a73e8;
          --primary-hover: #155fc1;
          --bg: #f5f7fa;
          --surface: #ffffff;
          --text: #1f2937;
          --text-muted: #6b7280;
          --border: #e5e7eb;
          --shadow-sm: 0 4px 14px rgba(15, 23, 42, 0.06);
          --shadow-md: 0 10px 28px rgba(15, 23, 42, 0.1);
          --radius-card: 14px;
          --radius-btn: 10px;
          --section-space: 64px;
          --container: 1200px;
          --ease: 0.25s ease;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial,
            sans-serif;
          line-height: 1.5;
        }

        img {
          max-width: 100%;
          display: block;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .section {
          padding: var(--section-space) 0;
        }

        .page-container {
          width: min(100% - 2rem, var(--container));
          margin-inline: auto;
        }

        .section-heading {
          font-size: clamp(1.5rem, 3.2vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
        }

        .section-sub {
          color: var(--text-muted);
          margin-bottom: 1.4rem;
        }

        .btn,
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid transparent;
          border-radius: var(--radius-btn);
          padding: 0.75rem 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--ease);
        }

        .btn-primary,
        .button-primary,
        .cta-primary {
          background: var(--primary);
          color: #fff;
        }

        .btn-primary:hover,
        .button-primary:hover,
        .cta-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .btn-outline,
        .button-outline {
          border-color: var(--primary);
          color: var(--primary);
          background: #fff;
        }

        .btn-outline:hover,
        .button-outline:hover {
          background: #eef4ff;
        }

        .top-nav,
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff;
          border-bottom: 1px solid var(--border);
          box-shadow: 0 1px 10px rgba(2, 6, 23, 0.04);
        }

        .top-nav .inner,
        .navbar .inner {
          width: min(100% - 2rem, var(--container));
          margin-inline: auto;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .logo,
        .brand-logo {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary) !important;
          letter-spacing: -0.02em;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.3rem;
        }

        .nav-menu .nav-link {
          color: var(--text);
          font-weight: 500;
          transition: color var(--ease);
        }

        .nav-menu .nav-link:hover {
          color: var(--primary);
        }

        .hero {
          background: linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .hero h1 {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 1rem;
          font-weight: 800;
        }

        .hero p {
          color: var(--text-muted);
          font-size: 1.05rem;
          margin: 0 0 1.6rem;
          max-width: 620px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .hero-illustration {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .metric-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          text-align: center;
          padding: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .metric-value {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .metric-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .category-row {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .category-chip {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.85rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all var(--ease);
        }

        .category-chip:hover {
          border-color: #c6dbff;
          background: #f7fbff;
          transform: translateY(-2px);
        }

        .category-chip i {
          color: var(--primary);
          margin-bottom: 0.45rem;
          font-size: 1.1rem;
        }

        .credit-card-list {
          display: grid;
          gap: 1rem;
        }

        .credit-card-item {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-sm);
          display: grid;
          grid-template-columns: 220px 1fr auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          transition: all var(--ease);
        }

        .credit-card-item:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .credit-card-media img {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 10px;
        }

        .credit-card-content h3 {
          margin: 0 0 0.35rem;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .credit-card-content p {
          margin: 0 0 0.25rem;
          color: var(--text-muted);
          font-size: 0.93rem;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 1rem;
        }

        .partner-logo {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          min-height: 88px;
          display: grid;
          place-items: center;
          box-shadow: var(--shadow-sm);
          transition: all var(--ease);
          color: var(--text-muted);
          font-weight: 700;
        }

        .partner-logo:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          color: var(--text);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .feature-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .feature-card i {
          color: var(--primary);
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }

        .feature-card h4 {
          margin: 0 0 0.35rem;
          font-size: 1.02rem;
          font-weight: 700;
        }

        .feature-card p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.92rem;
        }

        .accordion-item {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          box-shadow: var(--shadow-sm);
        }

        .accordion-button {
          font-weight: 600;
          color: var(--text);
        }

        .accordion-button:not(.collapsed) {
          background: #eef4ff;
          color: #144ea5;
        }

        .awards-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(260px, 1fr);
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 0.25rem;
        }

        .award-card {
          scroll-snap-align: start;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .award-card h4 {
          margin: 0 0 0.3rem;
          font-size: 1.02rem;
          font-weight: 700;
        }

        .award-card p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.92rem;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .testimonial-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1rem;
          box-shadow: var(--shadow-sm);
        }

        .testimonial-card p {
          margin: 0 0 0.7rem;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .testimonial-user {
          font-size: 0.92rem;
          font-weight: 700;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .blog-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--ease);
        }

        .blog-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .blog-card-content {
          padding: 1rem;
        }

        .blog-card h3 {
          margin: 0 0 0.35rem;
          font-size: 1.02rem;
          font-weight: 700;
        }

        .blog-card p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.92rem;
        }

        .app-banner {
          background: linear-gradient(135deg, #1a73e8 0%, #2e86ff 100%);
          color: #fff;
          border-radius: 16px;
          padding: 1.4rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: center;
          box-shadow: var(--shadow-md);
        }

        .app-banner .btn {
          background: #fff;
          color: var(--primary);
          border: 1px solid #fff;
        }

        .app-banner .btn:hover {
          background: #f5f9ff;
        }

        .site-footer {
          background: #0f172a;
          color: #d1d5db;
          margin-top: var(--section-space);
        }

        .footer-top {
          padding: 3rem 0 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr repeat(4, minmax(0, 1fr));
          gap: 1.2rem;
        }

        .footer-title {
          color: #fff;
          font-weight: 700;
          margin: 0 0 0.7rem;
        }

        .footer-links {
          display: grid;
          gap: 0.45rem;
        }

        .footer-links a {
          color: #cbd5e1;
          transition: color var(--ease);
          font-size: 0.94rem;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .social-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.75rem;
        }

        .social-row a {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.09);
          display: grid;
          place-items: center;
          transition: all var(--ease);
        }

        .social-row a:hover {
          background: var(--primary);
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          padding: 1rem 0;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        @media (max-width: 1100px) {
          .category-row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .partners-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .features-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .blog-grid,
          .testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          :root {
            --section-space: 40px;
          }

          .hero-grid {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            justify-content: center;
          }

          .credit-card-item {
            grid-template-columns: 1fr;
          }

          .metrics-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .partners-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .app-banner {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        @media (max-width: 560px) {
          :root {
            --section-space: 32px;
          }

          .category-row,
          .partners-grid,
          .features-grid,
          .testimonials-grid,
          .blog-grid,
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            font-size: 1.85rem;
          }

          .btn,
          .button {
            width: 100%;
          }
        }
      `}</style>

      <header className="top-nav">
        <div className="inner">
          <a className="brand-logo" href="/">
            CreditCardMarket
          </a>

          <nav className="navbar navbar-expand-lg p-0">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav nav-menu ms-auto align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link" href="#how-it-works">
                    How It Works
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Banks
                  </a>
                  <ul className="dropdown-menu">
                    {isLoading ? (
                      <li>
                        <span className="dropdown-item-text text-muted">Loading banks...</span>
                      </li>
                    ) : banks.length ? (
                      banks.map((bank) => (
                        <li key={bank.slug}>
                          <a className="dropdown-item" href={`/bank.html?bank=${encodeURIComponent(bank.slug)}`}>
                            {bank.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="dropdown-item-text text-muted">No banks available</span>
                      </li>
                    )}
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#categories">
                    Categories
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#featured-cards">
                    Offers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#blog">
                    Blog
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/admin.html">
                    Admin
                  </a>
                </li>
                <li className="nav-item ms-lg-2">
                  <a className="btn btn-dark rounded-pill px-4" href="#download-app">
                    Get Started
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="section hero" id="how-it-works">
          <div className="page-container hero-grid">
            <div>
              <h1>Your Credit Cards, Compared & Recommended by AI</h1>
              <p>
                Discover the best card for your lifestyle in minutes — compare rewards, fees,
                eligibility, and instant offers from top Indian banks.
              </p>
              <div className="hero-actions">
                <a href="#featured-cards" className="btn btn-primary">
                  Check Eligibility Now
                </a>
                <a href="#featured-cards" className="btn btn-outline">
                  See All Cards
                </a>
              </div>
            </div>

            <div className="hero-illustration">
              <img src={heroImage} alt="Credit card marketplace illustration" />
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="page-container metrics-row">
            <article className="metric-card">
              <div className="metric-value">{formatCompact(totalCards)}+</div>
              <div className="metric-label">Cards Compared</div>
            </article>
            <article className="metric-card">
              <div className="metric-value">{formatCompact(banks.length)}+</div>
              <div className="metric-label">Partner Banks</div>
            </article>
            <article className="metric-card">
              <div className="metric-value">200K+</div>
              <div className="metric-label">Monthly Users</div>
            </article>
            <article className="metric-card">
              <div className="metric-value">4.8/5</div>
              <div className="metric-label">User Satisfaction</div>
            </article>
          </div>
        </section>

        <section className="section pt-0" id="categories">
          <div className="page-container">
            <h2 className="section-heading">Popular Categories</h2>
            <div className="category-row">
              {[
                ['fa-plane', 'Travel'],
                ['fa-cart-shopping', 'Shopping'],
                ['fa-utensils', 'Dining'],
                ['fa-gas-pump', 'Fuel'],
                ['fa-gift', 'Rewards'],
                ['fa-wallet', 'Cashback'],
              ].map(([icon, label]) => (
                <article className="category-chip" key={label}>
                  <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
                  <div>{label}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="featured-cards">
          <div className="page-container">
            <h2 className="section-heading">Featured Credit Cards</h2>
            <p className="section-sub">Compare top cards and apply instantly in a few clicks.</p>

            <div className="credit-card-list">
              {featuredCards.length ? (
                featuredCards.map((card) => (
                  <article className="credit-card-item" key={`${card.bankSlug}-${card.slug}`}>
                    <div className="credit-card-media">
                      <img
                        src={
                          card.imageUrl ||
                          `https://via.placeholder.com/500x280/1A73E8/ffffff?text=${encodeURIComponent(
                            card.name
                          )}`
                        }
                        alt={card.name}
                      />
                    </div>
                    <div className="credit-card-content">
                      <h3>{card.name}</h3>
                      <p>
                        <strong>Bank:</strong> {card.bankName}
                      </p>
                      <p>{card.description || 'Premium benefits and rewards tailored to your spends.'}</p>
                      <p>
                        <strong>Annual Fee:</strong> {card.annualFee || 'As per issuer terms'}
                      </p>
                    </div>
                    <div>
                      <a
                        className="btn btn-primary"
                        href={`/card.html?bank=${encodeURIComponent(card.bankSlug)}&card=${encodeURIComponent(card.slug)}`}
                      >
                        Apply Now
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <article className="card-surface p-4 text-center text-muted">
                  No cards available. Add cards from Admin and they will appear here.
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="page-container">
            <h2 className="section-heading">Top Partner Banks</h2>
            <div className="partners-grid">
              {banksToShow.length
                ? banksToShow.map((bank) => <article key={bank.slug} className="partner-logo">{bank.name}</article>)
                : ['HDFC', 'SBI', 'Axis', 'ICICI', 'Kotak', 'IDFC'].map((name) => (
                    <article key={name} className="partner-logo">
                      {name}
                    </article>
                  ))}
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="page-container">
            <h2 className="section-heading">Why Choose CreditCardMarket</h2>
            <div className="features-grid">
              {[
                ['fa-scale-balanced', 'Smart Comparison', 'Compare fees, rewards, and eligibility side by side.'],
                ['fa-circle-check', 'Fast Eligibility', 'Instantly understand your likely approval chances.'],
                ['fa-bolt', 'Quick Apply', 'Apply directly through trusted issuer flows.'],
                ['fa-shield', 'Secure Data', 'Your information is protected with strong safeguards.'],
              ].map(([icon, title, desc]) => (
                <article className="feature-card" key={title}>
                  <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0" id="education">
          <div className="page-container">
            <h2 className="section-heading">Learn Before You Apply</h2>
            <div className="accordion" id="educationAccordion">
              {[
                ['How to choose the right card?', 'Pick based on your spend categories, annual fee value, and redemption flexibility.'],
                ['What credit score is ideal?', 'A score of 750+ usually improves card approval and better limit offers.'],
                ['Are there hidden charges?', 'Always review joining fee, annual fee, finance charge, and late payment terms.'],
                ['How to maximize rewards?', 'Use category-specific cards and track milestone offers regularly.'],
              ].map(([title, body], index) => {
                const itemId = `edu-${index}`
                return (
                  <div className="accordion-item" key={itemId}>
                    <h3 className="accordion-header" id={`${itemId}-head`}>
                      <button
                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${itemId}-body`}
                        aria-expanded={index === 0}
                        aria-controls={`${itemId}-body`}
                      >
                        {title}
                      </button>
                    </h3>
                    <div
                      id={`${itemId}-body`}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      aria-labelledby={`${itemId}-head`}
                      data-bs-parent="#educationAccordion"
                    >
                      <div className="accordion-body text-muted">{body}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section pt-0" id="awards">
          <div className="page-container">
            <h2 className="section-heading">Awards & Recognition</h2>
            <div className="awards-track">
              {[
                ['Best Fintech UX 2025', 'Recognized for user-first card comparison experience.'],
                ['Top Credit Marketplace', 'Trusted platform for discovering cards in India.'],
                ['Fastest Growth Award', 'Rapid adoption among young professionals and families.'],
                ['Innovation in AI Advice', 'Personalized card recommendations backed by data.'],
              ].map(([title, desc]) => (
                <article className="award-card" key={title}>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="testimonials">
          <div className="page-container">
            <h2 className="section-heading">What Customers Say</h2>
            <div className="testimonials-grid">
              {[
                ['“Found the best travel card in under 10 minutes.”', 'Aman S. · Bengaluru'],
                ['“The comparison made annual fee vs rewards super clear.”', 'Neha P. · Mumbai'],
                ['“Applied directly and got approved quickly.”', 'Rahul K. · Delhi'],
              ].map(([quote, user]) => (
                <article className="testimonial-card" key={user}>
                  <p>{quote}</p>
                  <div className="testimonial-user">{user}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0" id="faq">
          <div className="page-container faq-section">
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              {[
                ['Does checking eligibility impact my score?', 'No. Soft checks on this platform do not reduce your credit score.'],
                ['How often are card details updated?', 'We regularly sync card data; still verify final issuer terms before applying.'],
                ['Can I compare multiple cards?', 'Yes, you can compare rewards, annual fee, and eligibility parameters side by side.'],
              ].map(([title, body], index) => {
                const itemId = `faq-${index}`
                return (
                  <div className="accordion-item" key={itemId}>
                    <h3 className="accordion-header" id={`${itemId}-head`}>
                      <button
                        className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${itemId}-body`}
                        aria-expanded={index === 0}
                        aria-controls={`${itemId}-body`}
                      >
                        {title}
                      </button>
                    </h3>
                    <div
                      id={`${itemId}-body`}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      aria-labelledby={`${itemId}-head`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{body}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section" id="blog">
          <div className="page-container">
            <h2 className="section-heading">Latest From Our Blog</h2>
            <div className="blog-grid">
              {[
                ['https://via.placeholder.com/800x420/1A73E8/ffffff?text=Credit+Score+Guide', 'How to Improve Your Credit Score Before Applying', 'Actionable ways to strengthen approval odds for premium cards.'],
                ['https://via.placeholder.com/800x420/1A73E8/ffffff?text=Rewards+Guide', 'Cashback vs Rewards: Which Card Is Better?', 'Pick the right card model based on your monthly spending.'],
                ['https://via.placeholder.com/800x420/1A73E8/ffffff?text=Travel+Cards', 'Best Card Features for Frequent Travelers', 'Lounge, forex markup, and milestone benefits explained simply.'],
              ].map(([image, title, desc]) => (
                <article className="blog-card" key={title}>
                  <img src={image} alt={title} />
                  <div className="blog-card-content">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0" id="download-app">
          <div className="page-container">
            <article className="app-banner">
              <div>
                <h2 className="h4 mb-2 fw-bold">Get the CreditCardMarket App</h2>
                <p className="mb-0">Track offers, compare cards on the go, and apply instantly from your phone.</p>
              </div>
              <a href="#" className="btn">
                Download App
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-top">
          <div className="footer-grid">
            <div>
              <h3 className="footer-title">CreditCardMarket</h3>
              <p className="mb-2">India’s modern credit card marketplace for smarter decisions.</p>
              <div className="social-row">
                <a href="#" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="X">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Cards</h4>
              <div className="footer-links">
                <a href="#featured-cards">Travel Cards</a>
                <a href="#featured-cards">Cashback Cards</a>
                <a href="#featured-cards">Rewards Cards</a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Company</h4>
              <div className="footer-links">
                <a href="#how-it-works">How It Works</a>
                <a href="#features">Features</a>
                <a href="#blog">Blog</a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Resources</h4>
              <div className="footer-links">
                <a href="#faq">FAQs</a>
                <a href="#education">Guides</a>
                <a href="/admin.html">Admin</a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Legal</h4>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Disclosures</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="page-container">© 2026 CreditCardMarket. All rights reserved.</div>
        </div>
      </footer>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </>
  )
}
