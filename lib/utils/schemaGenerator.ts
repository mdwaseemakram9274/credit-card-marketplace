/**
 * Schema Generation Utilities
 * Create structured data (JSON-LD) for SEO and social sharing
 */

export interface SchemaGeneratorOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

export interface ProductSchemaOptions extends SchemaGeneratorOptions {
  price?: string;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  ratingCount?: number;
  bestRating?: number;
  worstRating?: number;
  additionalProperties?: { [key: string]: any };
}

export interface OrganizationSchemaOptions {
  name: string;
  url: string;
  logo?: string;
  description: string;
  telephone?: string;
  email?: string;
  sameAs?: string[]; // Social media URLs
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

export interface BreadcrumbItem {
  position: number;
  name: string;
  item?: string;
}

/**
 * Generate JSON-LD Product schema for credit cards
 */
export function generateProductSchema(options: ProductSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.title,
    description: options.description,
    url: options.url,
    image: options.image,
    author: {
      '@type': 'Organization',
      name: 'Credit Card Marketplace',
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    ...(options.price && {
      offers: {
        '@type': 'Offer',
        priceCurrency: options.priceCurrency || 'INR',
        price: options.price,
        availability:
          options.availability === 'InStock'
            ? 'https://schema.org/InStock'
            : `https://schema.org/${options.availability || 'InStock'}`,
        url: options.url,
      },
    }),
    ...(options.ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: options.ratingValue,
        ratingCount: options.ratingCount || 1,
        bestRating: options.bestRating || 5,
        worstRating: options.worstRating || 1,
      },
    }),
    ...(options.additionalProperties && {
      additionalProperty: Object.entries(options.additionalProperties).map(([name, value]) => ({
        '@type': 'PropertyValue',
        name,
        value: String(value),
      })),
    }),
  };
}

/**
 * Generate JSON-LD Article schema for blog posts or informational pages
 */
export function generateArticleSchema(options: SchemaGeneratorOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    image: options.image,
    author: {
      '@type': 'Organization',
      name: options.author || 'Credit Card Marketplace',
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    url: options.url,
    publisher: {
      '@type': 'Organization',
      name: 'Credit Card Marketplace',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-domain.com/logo.png',
      },
    },
  };
}

/**
 * Generate JSON-LD Organization schema for banks/lenders
 */
export function generateOrganizationSchema(options: OrganizationSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: options.name,
    url: options.url,
    logo: options.logo,
    description: options.description,
    telephone: options.telephone,
    email: options.email,
    sameAs: options.sameAs || [],
    ...(options.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: options.address.streetAddress,
        addressLocality: options.address.addressLocality,
        addressRegion: options.address.addressRegion,
        postalCode: options.address.postalCode,
        addressCountry: options.address.addressCountry,
      },
    }),
  };
}

/**
 * Generate JSON-LD BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };
}

/**
 * Generate JSON-LD FAQPage schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD SearchAction schema (for search integration)
 */
export function generateSearchActionSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={query}`,
      },
      query_input: 'required name=query',
    },
  };
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(options: {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
}) {
  return {
    'og:title': options.title,
    'og:description': options.description,
    'og:url': options.url,
    'og:type': options.type || 'website',
    'og:locale': options.locale || 'en_IN',
    ...(options.image && {
      'og:image': options.image,
      'og:image:alt': options.imageAlt || options.title,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
    }),
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(options: {
  title: string;
  description: string;
  image?: string;
  creator?: string;
  site?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
}) {
  return {
    'twitter:card': options.card || 'summary_large_image',
    'twitter:title': options.title,
    'twitter:description': options.description,
    ...(options.image && { 'twitter:image': options.image }),
    ...(options.creator && { 'twitter:creator': options.creator }),
    ...(options.site && { 'twitter:site': options.site }),
  };
}

/**
 * Combine all meta tags into React Head-compatible format
 */
export function generateMetaTags(options: {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
  canonical?: string;
  author?: string;
  keywords?: string[];
  openGraph?: false | Parameters<typeof generateOpenGraphTags>[0];
  twitter?: false | Parameters<typeof generateTwitterCardTags>[0];
  schema?: any[];
}) {
  const metaTags: { [key: string]: string }[] = [];
  const schemas: any[] = [];

  // Standard meta tags
  metaTags.push({ name: 'description', content: options.description });
  if (options.robots) {
    metaTags.push({ name: 'robots', content: options.robots });
  }
  if (options.keywords?.length) {
    metaTags.push({ name: 'keywords', content: options.keywords.join(', ') });
  }
  if (options.author) {
    metaTags.push({ name: 'author', content: options.author });
  }

  // Open Graph tags
  if (options.openGraph !== false) {
    const ogTags = generateOpenGraphTags(
      options.openGraph || {
        title: options.title,
        description: options.description,
        url: options.url,
        image: options.image,
        imageAlt: options.imageAlt,
      }
    );
    Object.entries(ogTags).forEach(([key, value]) => {
      metaTags.push({ property: key, content: String(value) });
    });
  }

  // Twitter Card tags
  if (options.twitter !== false) {
    const twitterTags = generateTwitterCardTags(
      options.twitter || {
        title: options.title,
        description: options.description,
        image: options.image,
      }
    );
    Object.entries(twitterTags).forEach(([key, value]) => {
      metaTags.push({ name: key, content: String(value) });
    });
  }

  // JSON-LD Schemas
  if (options.schema?.length) {
    schemas.push(...options.schema);
  }

  return { metaTags, canonical: options.canonical, schemas };
}
