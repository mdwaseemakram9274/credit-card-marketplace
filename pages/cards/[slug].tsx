import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getSupabaseServerClient } from '@/lib/supabase-server';

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
  };
}

const CardDetailPage: NextPage<CardPageProps> = ({ cardId, card }) => {
  const title = card 
    ? `${card.card_name} | Review, Fees & Benefits 2026 | Fintech`
    : 'Credit Card Details | Fintech';
  
  const description = card?.description || 'View detailed information about this credit card including benefits, fees, eligibility and more.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {card?.card_image_url && <meta property="og:image" content={card.card_image_url} />}
        <meta property="og:type" content="product" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://fintech.com/cards/${cardId}`} />
        
        {/* JSON-LD Schema for Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: card?.card_name,
              description: description,
              image: card?.card_image_url,
              brand: card?.banks?.name,
              url: `https://fintech.com/cards/${cardId}`,
            }),
          }}
        />
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
