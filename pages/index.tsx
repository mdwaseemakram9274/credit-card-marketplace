import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Credit Card Marketplace India</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </Head>

      <style jsx global>{`
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #f8f9fa;
        }
        .hero {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
        }
        .card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>

      <div className="hero">
        <div className="container">
          <h1 className="display-3 fw-bold mb-4">Best Credit Cards in India 2026</h1>
          <p className="lead mb-5">
            Compare rewards • cashback • travel benefits • fees
            <br />
            Apply online – fast & easy
          </p>
          <a href="#categories" className="btn btn-light btn-lg px-5 py-3 fw-bold">
            Find Your Perfect Card
          </a>
        </div>
      </div>

      <section id="categories" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Popular Categories</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-5">
                  <h3 className="card-title fw-bold text-primary mb-4">Rewards Cards</h3>
                  <p className="card-text text-muted mb-4">
                    Earn high points on shopping, dining, movies & more
                  </p>
                  <a href="#" className="btn btn-outline-primary">
                    View Rewards Cards
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-5">
                  <h3 className="card-title fw-bold text-primary mb-4">Cashback Cards</h3>
                  <p className="card-text text-muted mb-4">
                    Get instant cashback on fuel, groceries & online spends
                  </p>
                  <a href="#" className="btn btn-outline-primary">
                    View Cashback Cards
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-5">
                  <h3 className="card-title fw-bold text-primary mb-4">Travel Cards</h3>
                  <p className="card-text text-muted mb-4">
                    Lounge access • miles • travel insurance & offers
                  </p>
                  <a href="#" className="btn btn-outline-primary">
                    View Travel Cards
                  </a>
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
