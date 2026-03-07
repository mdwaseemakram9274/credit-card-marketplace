import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateOpenGraphTags,
  generateTwitterCardTags,
} from '@/lib/utils/schemaGenerator';

// Dynamically import lender page
const LenderPage = dynamic(
  () => import('@/designinhtmlcss/src/app/pages/LenderPage'),
  { ssr: true }
);

interface LenderPageProps {
  lenderId: string;
  lender?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    card_count?: number;
  };
}

const LenderDetailPage: NextPage<LenderPageProps> = ({ lenderId, lender }) => {
  const baseUrl = 'https://creditcardmarketplace.com';
  const title = lender
    ? `${lender.name} Credit Cards | Compare Best Offers 2025`
    : 'Bank Credit Cards';

  const description = lender?.description
    ? lender.description.slice(0, 160)
    : `Explore all credit cards from ${lender?.name}. Compare features, fees, and benefits.`;

  const pageUrl = `${baseUrl}/lenders/${lenderId}`;

  // Generate structured data
  const organizationSchema = lender
    ? generateOrganizationSchema({
        name: lender.name,
        url: pageUrl,
        logo: lender.logo_url,
        description: description,
      })
    : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { position: 1, name: 'Home', item: baseUrl },
    { position: 2, name: 'Lenders', item: `${baseUrl}/lenders` },
    { position: 3, name: lender?.name || 'Bank' },
  ]);

  const ogTags = generateOpenGraphTags({
    title,
    description,
    url: pageUrl,
    image: lender?.logo_url,
    imageAlt: `${lender?.name} logo`,
    type: 'website',
  });

  const twitterTags = generateTwitterCardTags({
    title,
    description,
    image: lender?.logo_url,
    card: 'summary_large_image',
  });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="charset" content="utf-8" />

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

        {/* JSON-LD Schemas */}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>
      <LenderPage />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const supabase = getSupabaseServerClient();
    const { data: lenders } = await supabase
      .from('banks')
      .select('id, slug')
      .eq('status', 'active')
      .limit(100);

    const paths = (lenders || []).map((lender) => ({
      params: { slug: lender.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating lender paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<LenderPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const supabase = getSupabaseServerClient();
    
    const { data: lender } = await supabase
      .from('banks')
      .select(
        `
        id,
        name,
        slug,
        description,
        logo_url
      `
      )
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (!lender) {
      return {
        notFound: true,
        revalidate: 3600,
      };
    }

    // Get card count for this lender
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('bank_id', lender.id)
      .eq('status', 'enabled');

    return {
      props: {
        lenderId: slug,
        lender: {
          ...lender,
          card_count: count || 0,
        },
      },
      revalidate: 3600, // ISR: revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching lender:', error);
    return {
      notFound: true,
      revalidate: 3600,
    };
  }
};

export default LenderDetailPage;
