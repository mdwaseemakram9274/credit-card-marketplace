import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import HomePage to ensure it's SSR-friendly
const HomePage = dynamic(() => import('@/designinhtmlcss/src/app/pages/HomePage'), { ssr: true });

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Best Credit Cards in India 2026 | Compare & Apply | Fintech</title>
        <meta name="description" content="Compare 500+ credit cards from India's leading banks. Find the best card for rewards, cashback, travel & more. Apply online instantly." />
        <meta name="keywords" content="credit card, best credit cards, credit card comparison, HDFC, ICICI, SBI" />
        <meta property="og:title" content="Best Credit Cards in India 2026" />
        <meta property="og:description" content="Compare premium credit cards with exclusive benefits, rewards & cashback." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintech.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fintech.com" />
      </Head>
      <HomePage />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // ISR: revalidate every hour
  };
};

export default Home;
