import React from 'react';
import Head from 'next/head';
import { CardSearchPanel } from '../designinhtmlcss/src/app/components/CardSearchPanel';

/**
 * Search Results Page
 * Dedicated page for advanced credit card search with filtering
 */
const SearchPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Search Credit Cards - Find Your Perfect Card</title>
        <meta
          name="description"
          content="Search and filter credit cards by network, bank, fees, benefits, and more. Find the perfect credit card for your needs."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Search Credit Cards - Find Your Perfect Card" />
        <meta
          property="og:description"
          content="Advanced search with filters for credit cards"
        />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa', marginBottom: '40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '700' }}>
              Find Your Perfect Credit Card
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
              Search, compare, and discover credit cards that match your lifestyle and financial
              goals
            </p>
          </div>
        </section>

        <section style={{ padding: '40px 0' }}>
          <CardSearchPanel />
        </section>

        {/* SEO Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://your-domain.com/search?q={query}',
            },
          })}
        </script>
      </main>
    </>
  );
};

export default SearchPage;
