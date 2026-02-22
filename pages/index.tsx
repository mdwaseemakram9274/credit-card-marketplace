import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

type MarketplaceBank = {
  slug: string
  name: string
  description?: string
  cards?: Array<{
    slug: string
    name: string
    description?: string
    imageUrl?: string
    annualFee?: string
  }>
}

type MarketplaceResponse = {
  source?: 'cloud' | 'local'
  banks: MarketplaceBank[]
}

export default function HomePage() {
  const [banks, setBanks] = useState<MarketplaceBank[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(true)

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
        setIsLoadingBanks(false)
      }
    }

    loadData()
  }, [])

  const banksToShow = useMemo(() => banks.slice(0, 6), [banks])

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
          --primary: #0d6efd;
          --text-dark: #111827;
          --text-muted: #6b7280;
          --bg-soft: #f8fafc;
          --border-soft: #e5e7eb;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
            Arial, 'Noto Sans', sans-serif;
          color: var(--text-dark);
          background: #fff;
        }

        .navbar-custom {
          background: #fff;
          box-shadow: 0 1px 10px rgba(15, 23, 42, 0.07);
          padding-top: 0.85rem;
          padding-bottom: 0.85rem;
        }

        .brand-logo {
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--primary) !important;
          letter-spacing: -0.02em;
        }

        .nav-link {
          color: #1f2937;
          font-weight: 500;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .btn-dark-round {
          border-radius: 999px;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
        }

        .hero {
          background: linear-gradient(180deg, #ffffff 0%, var(--bg-soft) 100%);
          padding: 7.5rem 0 5rem;
        }

        .hero-title {
          font-size: clamp(2.1rem, 6vw, 4.2rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          font-weight: 800;
          max-width: 1000px;
          margin: 0 auto 1.35rem;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.1vw, 1.3rem);
          color: var(--text-muted);
          max-width: 800px;
          margin: 0 auto 2.2rem;
        }

        .hero-actions .btn {
          min-width: 210px;
          border-radius: 0.75rem;
          font-weight: 600;
          padding: 0.85rem 1.2rem;
        }

        .feature-row {
          margin-top: 1.75rem;
          margin-bottom: 2.25rem;
        }

        .mini-feature {
          border: 1px solid var(--border-soft);
          border-radius: 0.9rem;
          background: #fff;
          padding: 1rem;
          height: 100%;
          transition: all 0.22s ease;
          box-shadow: 0 4px 14px rgba(2, 6, 23, 0.04);
        }

        .mini-feature:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px rgba(2, 6, 23, 0.08);
        }

        .mini-feature i {
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.6rem;
        }

        .mini-feature h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }

        .mini-feature p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .bank-card {
          border: 1px solid var(--border-soft);
          border-radius: 0.9rem;
          background: #fff;
          padding: 1rem;
          height: 100%;
          transition: all 0.22s ease;
          box-shadow: 0 4px 14px rgba(2, 6, 23, 0.04);
        }

        .bank-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px rgba(2, 6, 23, 0.08);
        }

        .privacy-note {
          font-size: 0.95rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-soft);
          padding: 1.2rem 0 1.8rem;
          margin-top: 2rem;
        }

        .privacy-note a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .privacy-note a:hover {
          text-decoration: underline;
        }

        @media (max-width: 575.98px) {
          .hero {
            padding-top: 6.4rem;
          }

          .hero-actions {
            width: 100%;
          }

          .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <header>
        <nav className="navbar navbar-expand-lg navbar-custom fixed-top" aria-label="Main navigation">
          <div className="container">
            <a className="navbar-brand brand-logo" href="#">
              CreditCardMarket
            </a>

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
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                <li className="nav-item">
                  <a className="nav-link" href="#">
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
                    {isLoadingBanks ? (
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
                  <a className="nav-link" href="#">
                    Categories
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Offers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    FAQ
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/admin.html">
                    Admin
                  </a>
                </li>
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <a className="btn btn-dark btn-dark-round" href="#">
                    Get Started
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div style={{ height: '80px' }}></div>

        <section className="hero text-center">
          <div className="container">
            <h1 className="hero-title">Your Credit Cards, Compared & Recommended by AI</h1>
            <p className="hero-subtitle">
              Discover the best card for your lifestyle in minutes — compare rewards, fees,
              eligibility, and instant offers from top Indian banks.
            </p>

            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center gap-3">
              <a href="#" className="btn btn-primary">
                Check Eligibility Now
              </a>
              <a href="#banks" className="btn btn-outline-primary">
                See All Cards
              </a>
            </div>

            <div className="row g-3 g-md-4 feature-row justify-content-center">
              <div className="col-12 col-sm-6 col-lg-3">
                <article className="mini-feature">
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                  <h3>Compare Cards</h3>
                  <p>Side-by-side card comparison for rewards, fees, and perks.</p>
                </article>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <article className="mini-feature">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  <h3>Check Eligibility</h3>
                  <p>Know your approval chances quickly with soft checks.</p>
                </article>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <article className="mini-feature">
                  <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                  <h3>Apply Instantly</h3>
                  <p>Fast application flow with trusted bank partners.</p>
                </article>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <article className="mini-feature">
                  <i className="fa-solid fa-tags" aria-hidden="true"></i>
                  <h3>Track Offers</h3>
                  <p>Stay updated on cashback, lounge, and joining bonus deals.</p>
                </article>
              </div>
            </div>

            <div id="banks" className="row g-3 g-md-4 mt-2 justify-content-center">
              {isLoadingBanks ? (
                <div className="col-12">
                  <p className="text-muted mb-0">Loading banks...</p>
                </div>
              ) : banksToShow.length ? (
                banksToShow.map((bank) => (
                  <div className="col-12 col-md-4" key={bank.slug}>
                    <article className="bank-card text-start">
                      <h3 className="h5 fw-bold">{bank.name} Credit Cards</h3>
                      <p className="text-muted mb-3">
                        {bank.description || `Explore ${bank.name} card listings and offers.`}
                      </p>
                      <a href={`/bank.html?bank=${encodeURIComponent(bank.slug)}`} className="btn btn-primary btn-sm">
                        View Cards
                      </a>
                    </article>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <article className="bank-card text-start">
                    <h3 className="h5 fw-bold mb-2">No banks available</h3>
                    <p className="text-muted mb-0">Add banks/cards from Admin and they will appear here automatically.</p>
                  </article>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container text-center">
          <p className="privacy-note mb-0">
            We respect your privacy. No spam, no selling data. <a href="#">See our Privacy Policy.</a>
          </p>
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
