import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getSupabaseServerClient } from '@/lib/supabase-server';

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
  const title = lender
    ? `${lender.name} Credit Cards | Best Offers 2026 | Fintech`
    : 'Bank Credit Cards | Fintech';

  const description = lender?.description 
    ? lender.description.slice(0, 160)
    : `Explore all credit cards from ${lender?.name}. Compare features, fees, and benefits.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {lender?.logo_url && <meta property="og:image" content={lender.logo_url} />}
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://fintech.com/lenders/${lenderId}`} />

        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Organization',
              name: lender?.name,
              url: `https://fintech.com/lenders/${lenderId}`,
              logo: lender?.logo_url,
              description: description,
            }),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://fintech.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: lender?.name,
                  item: `https://fintech.com/lenders/${lenderId}`,
                },
              ],
            }),
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
