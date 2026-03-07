import React from 'react';
import Head from 'next/head';
import { CardSearchPanel } from '../designinhtmlcss/src/app/components/CardSearchPanel';
import {
  generateSearchActionSchema,
  generateOpenGraphTags,
  generateTwitterCardTags,
} from '../lib/utils/schemaGenerator';

/**
 * Search Results Page
 * Dedicated page for advanced credit card search with filtering
 */
const SearchPage: React.FC = () => {
  const baseUrl = 'https://creditcardmarketplace.com';
  const pageUrl = `${baseUrl}/search`;
  const title = 'Find Your Perfect Credit Card - Compare & Search';
  const description =
    'Search and filter credit cards by network, bank, fees, benefits, and more. Find the perfect credit card for your financial needs.';

  const ogTags = generateOpenGraphTags({
    title,
    description,
    url: pageUrl,
    type: 'website',
  });

  const twitterTags = generateTwitterCardTags({
    title,
    description,
    card: 'summary',
  });

  const searchSchema = generateSearchActionSchema(baseUrl);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="charset" content="utf-8" />
        <meta name="keywords" content="credit cards, search, compare, filters, best cards" />

        {/* Open Graph Tags */}
        {Object.entries(ogTags).map(([key, value]) => (
          <meta key={`og-${key}`} property={key} content={String(value)} />
        ))}

        {/* Twitter Card Tags */}
        {Object.entries(twitterTags).map(([key, value]) => (
          <meta key={`twitter-${key}`} name={key} content={String(value)} />
        ))}

        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />

        {/* JSON-LD for Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(searchSchema),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: baseUrl,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Search Cards',
                  item: pageUrl,
                },
              ],
            }),
          }}
        />
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
      </main>
    </>
  );
};

export default SearchPage;
