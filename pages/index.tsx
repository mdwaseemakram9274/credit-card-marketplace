import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>CreditCardMarket | Fintech Landing Page</title>
        <meta
          name="description"
          content="Compare credit card offers with a premium, trust-first financial experience."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/landing-home.css" />
      </Head>

      <header className="site-header">
        <div className="container nav-row">
          <a href="/" className="brand">
            CreditCardMarket
          </a>
          <nav className="nav-links">
            <a href="#offers">Offers</a>
            <a href="#partners">Banks</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a href="/admin.html" className="btn btn-secondary">
              Login
            </a>
            <a href="#offers" className="btn btn-primary">
              Check Eligibility
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="container hero-content">
            <p className="hero-eyebrow">Bank-grade card recommendations</p>
            <h1>Better credit card decisions for financially serious users.</h1>
            <p className="hero-copy">
              Compare verified card offers, understand fee structures, and apply with confidence on
              a platform built for trust, not noise.
            </p>
            <div className="hero-actions">
              <a href="#offers" className="btn btn-primary">
                Check Eligibility
              </a>
              <a href="#partners" className="btn btn-secondary">
                View Partner Banks
              </a>
            </div>
          </div>
        </section>

        <section className="stats-bar">
          <div className="container stats-grid">
            <article>
              <p className="stat-value">100+</p>
              <p className="stat-label">Live Card Offers</p>
            </article>
            <article>
              <p className="stat-value">25+</p>
              <p className="stat-label">Partner Banks</p>
            </article>
            <article>
              <p className="stat-value">250K+</p>
              <p className="stat-label">Users Guided</p>
            </article>
            <article>
              <p className="stat-value">99.2%</p>
              <p className="stat-label">Offer Accuracy</p>
            </article>
          </div>
        </section>

        <section id="offers" className="section">
          <div className="container">
            <h2 className="section-title">Featured Credit Card Offers</h2>
            <p className="section-subtitle">
              Minimal, transparent comparisons for annual fee, issuer, and key value.
            </p>

            <article className="credit-card-item">
              <div className="card-left">
                <img
                  src="https://via.placeholder.com/320x200/ffffff/000000?text=SBI+Prime"
                  alt="SBI Card Prime"
                />
                <label className="compare-row">
                  <input type="checkbox" />
                  <span>Compare</span>
                </label>
              </div>

              <div className="card-middle">
                <h3>SBI Card PRIME</h3>
                <ul>
                  <li>5X rewards on dining, movies & grocery</li>
                  <li>Pizza Hut vouchers worth up to Rs. 4,000 in a year</li>
                  <li>8 domestic & 4 international lounge visits yearly</li>
                </ul>
                <p>
                  <strong>Joining Fee:</strong> ₹2,999 + Taxes
                </p>
                <p>
                  <strong>Annual/Renewal Fee:</strong> ₹2,999 + Taxes
                </p>
              </div>

              <div className="card-right">
                <div className="tag-row">
                  <span className="tag-pill">Travel</span>
                  <span className="tag-pill">Shopping</span>
                  <span className="tag-pill">Rewards</span>
                </div>
                <div className="card-actions">
                  <a href="#" className="read-more">
                    Read More
                  </a>
                  <a href="#" className="btn btn-primary">
                    Check Eligibility →
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="partners" className="section section-tight">
          <div className="container">
            <h2 className="section-title">Trusted Bank Partners</h2>
            <div className="partner-grid">
              <span>HDFC</span>
              <span>SBI</span>
              <span>Axis</span>
              <span>ICICI</span>
              <span>Kotak</span>
              <span>IDFC</span>
            </div>
          </div>
        </section>

        <section id="faq" className="section section-tight">
          <div className="container faq-wrap">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <details>
              <summary>Does checking eligibility affect my credit score?</summary>
              <p>
                No. Eligibility checks here are informational and do not reduce your bureau score.
              </p>
            </details>
            <details>
              <summary>How often are offers updated?</summary>
              <p>Offer details are refreshed frequently, but final terms remain issuer controlled.</p>
            </details>
            <details>
              <summary>Are approvals guaranteed?</summary>
              <p>No. Approval depends on each issuing bank’s internal policy and risk checks.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>CreditCardMarket</h3>
            <p>
              A trust-first financial marketplace for comparing credit card offers with transparency
              and clarity.
            </p>
          </div>
          <div>
            <h4>Cards</h4>
            <a href="#offers">All Offers</a>
            <a href="#offers">Rewards Cards</a>
            <a href="#offers">Cashback Cards</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#faq">FAQs</a>
            <a href="#">Education</a>
            <a href="#">Support</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Compliance</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 CreditCardMarket. All rights reserved.</p>
          <p>RBI-aligned disclosure norms • High-trust financial communication standards</p>
        </div>
      </footer>
    </>
  );
}
