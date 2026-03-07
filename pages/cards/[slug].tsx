import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateOpenGraphTags,
  generateTwitterCardTags,
} from '@/lib/utils/schemaGenerator';

// Dynamically import card detail page
const CreditCardDetailPage = dynamic(
  () => import('@/designinhtmlcss/src/app/pages/CreditCardDetailPage'),
  { ssr: true }
);

interface CardPageProps {
  cardId: string;
  card?: {
    id: string;
    card_name: string;
    description?: string;
    slug?: string;
    card_image_url?: string;
    banks?: { name: string; slug: string };
    annual_fee?: string;
    joining_fee?: string;
    welcome_bonus?: string;
    benefits?: string[];
  };
}

const CardDetailPage: NextPage<CardPageProps> = ({ cardId, card }) => {
  const baseUrl = 'https://creditcardmarketplace.com';
  const title = card
    ? `${card.card_name} | Review, Fees & Benefits 2025`
    : 'Credit Card Details';

  const description =
    card?.description ||
    'View detailed information about this credit card including benefits, fees, eligibility and more.';

  const pageUrl = `${baseUrl}/cards/${cardId}`;

  // Generate structured data
  const productSchema = card
    ? generateProductSchema({
        title: card.card_name,
        description: description,
        url: pageUrl,
        image: card.card_image_url,
        imageAlt: card.card_name,
        datePublished: new Date().toISOString(),
        additionalProperties: {
          'Annual Fee': card.annual_fee || 'Contact Bank',
          'Joining Fee': card.joining_fee || 'Contact Bank',
          'Welcome Bonus': card.welcome_bonus || 'No Bonus',
          Bank: card.banks?.name || 'Unknown Bank',
          Network: 'Visa/Mastercard',
        },
      })
    : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { position: 1, name: 'Home', item: baseUrl },
    { position: 2, name: 'Cards', item: `${baseUrl}/cards` },
    {
      position: 3,
      name: card?.banks?.name || 'Bank',
      item: `${baseUrl}/lenders/${card?.banks?.slug}`,
    },
    { position: 4, name: card?.card_name || 'Card' },
  ]);

  const ogTags = generateOpenGraphTags({
    title,
    description,
    url: pageUrl,
    image: card?.card_image_url,
    imageAlt: card?.card_name,
    type: 'product',
  });

  const twitterTags = generateTwitterCardTags({
    title,
    description,
    image: card?.card_image_url,
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
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productSchema),
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        {/* Preconnect to CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </Head>
      <CreditCardDetailPage />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const supabase = getSupabaseServerClient();
    const { data: cards } = await supabase
      .from('cards')
      .select('id, slug')
      .eq('status', 'enabled')
      .limit(500);

    const paths = (cards || []).map((card) => ({
      params: { slug: card.slug || card.id },
    }));

    return {
      paths,
      fallback: 'blocking', // ISR: build on-demand for new cards
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<CardPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const supabase = getSupabaseServerClient();
    const { data: card } = await supabase
      .from('cards')
      .select(
        `
        id,
        card_name,
        description,
        slug,
        card_image_url,
        banks (
          name,
          slug
        )
      `
      )
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .eq('status', 'enabled')
      .single();

    if (!card) {
      return {
        notFound: true,
        revalidate: 3600,
      };
    }

    return {
      props: {
        cardId: slug,
        card,
      },
      revalidate: 3600, // ISR: revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching card:', error);
    return {
      notFound: true,
      revalidate: 3600,
    };
  }
};

export default CardDetailPage;
