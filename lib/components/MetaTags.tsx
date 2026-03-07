import React from 'react';
import Head from 'next/head';
import {
  generateOpenGraphTags,
  generateTwitterCardTags,
  type SchemaGeneratorOptions,
} from '../utils/schemaGenerator';

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
  canonical?: string;
  keywords?: string[];
  author?: string;
  schema?: any[];
  twitterHandle?: string;
  twitterSite?: string;
  locale?: string;
}

/**
 * React component to render all meta tags in a Next.js Head
 * Usage: <MetaTags title="..." description="..." url="..." />
 */
export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  url,
  image,
  imageAlt,
  robots = 'index, follow',
  canonical,
  keywords,
  author,
  schema,
  twitterHandle,
  twitterSite,
  locale = 'en_IN',
}) => {
  const ogTags = generateOpenGraphTags({
    title,
    description,
    url,
    image,
    imageAlt,
    locale,
  });

  const twitterTags = generateTwitterCardTags({
    title,
    description,
    image,
    creator: twitterHandle,
    site: twitterSite,
  });

  return (
    <Head>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="charset" content="utf-8" />

      {/* Author and Keywords */}
      {author && <meta name="author" content={author} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      {Object.entries(ogTags).map(([key, value]) => (
        <meta key={`og-${key}`} property={key} content={String(value)} />
      ))}

      {/* Twitter Card Meta Tags */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={`twitter-${key}`} name={key} content={String(value)} />
      ))}

      {/* JSON-LD Structured Data */}
      {schema &&
        schema.length > 0 &&
        schema.map((s, idx) => (
          <script
            key={`schema-${idx}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(s),
            }}
          />
        ))}

      {/* Additional SEO Enhancements */}
      <meta name="theme-color" content="#667eea" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Head>
  );
};

export default MetaTags;
