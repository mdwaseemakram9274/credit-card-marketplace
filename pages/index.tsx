import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Credit Card Marketplace – Best Cards in India 2026</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Compare best credit cards in India - HDFC, SBI, Axis, ICICI. Check eligibility, benefits, fees and apply online."
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
          --primary-dark: #0a58ca;
          --primary-light: #cfe2ff;
          --gray-light: #f8f9fa;
          --text-dark: #212529;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
          background-color: var(--gray-light);
          color: var(--text-dark);
          line-height: 1.6;
        }

        .navbar {
          background: white !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 1rem 0;
        }

        .navbar-brand {
          font-weight: 800;
          color: var(--primary) !important;
          font-size: 1.6rem;
        }

        .hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 9rem 1rem 11rem;
          position: relative;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero .lead {
          font-size: 1.4rem;
          max-width: 720px;
          margin: 0 auto 2.5rem;
          opacity: 0.95;
        }

        .eligibility-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
          padding: 2.25rem;
        }

        .card-feature {
          transition: all 0.25s ease;
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-feature:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14) !important;
        }

        .badge-pill {
          padding: 0.6em 1.2em;
          font-size: 0.95rem;
          font-weight: 600;
        }

        @media (max-width: 991px) {
          .hero {
            padding: 7rem 1rem 9rem;
          }
          .hero h1 {
            font-size: 2.8rem;
          }
          .eligibility-card {
            margin-top: 3rem;
          }
        }

        @media (max-width: 576px) {
          .hero h1 {
            font-size: 2.4rem;
          }
          .hero .lead {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            CreditCardMarket
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link px-3" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">
                  Banks
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">
                  Categories
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#">
                  Offers
                </a>
              </li>
              <li className="nav-item ms-lg-3">
                <a className="btn btn-outline-primary px-4" href="#">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ height: '80px' }}></div>

      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h1>Get the Perfect Credit Card for You</h1>
              <p className="lead">
                Instant eligibility check • 100+ cards • No impact on CIBIL score • From HDFC,
                SBI, Axis, ICICI, Kotak, IDFC & more
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <span className="badge bg-white text-primary badge-pill">Lifetime Free</span>
                <span className="badge bg-white text-primary badge-pill">High Cashback</span>
                <span className="badge bg-white text-primary badge-pill">Airport Lounge</span>
                <span className="badge bg-white text-primary badge-pill">Reward Points</span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="eligibility-card">
                <h3 className="text-center fw-bold mb-4">Check Eligibility in 60 Seconds</h3>
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="Mobile Number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="Monthly Income (₹)"
                      min="10000"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold">
                    Check Eligibility Now
                  </button>
                  <p className="text-center text-muted small mt-3 mb-0">
                    100% secure • We never sell your data
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Our Top Picks For You</h2>

          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card card-feature h-100">
                <img
                  src="https://via.placeholder.com/460x220/0d6efd/ffffff?text=IDFC+Millennia"
                  className="card-img-top"
                  alt="IDFC FIRST Millennia"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">IDFC FIRST Millennia</h5>
                  <p className="card-text text-muted small flex-grow-1 mb-3">
                    Lifetime free • 10X rewards on Amazon, Flipkart, Swiggy
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-success">Cashback</span>
                    <a href="#" className="btn btn-sm btn-primary">
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card card-feature h-100">
                <img
                  src="https://via.placeholder.com/460x220/0d6efd/ffffff?text=Axis+ACE"
                  className="card-img-top"
                  alt="Axis ACE"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Axis Bank ACE</h5>
                  <p className="card-text text-muted small flex-grow-1 mb-3">
                    5% unlimited cashback on Flipkart, Amazon, Swiggy, Zomato
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-info">Rewards</span>
                    <a href="#" className="btn btn-sm btn-primary">
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card card-feature h-100">
                <img
                  src="https://via.placeholder.com/460x220/0d6efd/ffffff?text=HDFC+Regalia"
                  className="card-img-top"
                  alt="HDFC Regalia"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">HDFC Regalia Gold</h5>
                  <p className="card-text text-muted small flex-grow-1 mb-3">
                    4 RP / ₹150 • 12 lounge visits • Milestone rewards
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-primary">Travel</span>
                    <a href="#" className="btn btn-sm btn-primary">
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </>
  )
}
