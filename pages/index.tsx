import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { AppDownloadSection } from '../components/landing/AppDownloadSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { BlogSection } from '../components/landing/BlogSection';
import { FAQSection } from '../components/landing/FAQSection';
import { FooterSection } from '../components/landing/FooterSection';
import { HeroSection } from '../components/landing/HeroSection';
import { Navbar } from '../components/landing/Navbar';
import { OffersSection } from '../components/landing/OffersSection';
import { PartnersSection } from '../components/landing/PartnersSection';
import { TrustStatsSection } from '../components/landing/TrustStatsSection';
import { FeaturedCard, MarketplaceBank, MarketplaceResponse } from '../components/landing/types';

export default function HomePage() {
  const [banks, setBanks] = useState<MarketplaceBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/marketplace-data');
        const payload = (await response.json()) as MarketplaceResponse;

        if (response.ok && Array.isArray(payload.banks)) {
          setBanks(payload.banks);
        } else {
          setBanks([]);
        }
      } catch {
        setBanks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredCards = useMemo<FeaturedCard[]>(() => {
    return banks
      .flatMap((bank) =>
        (bank.cards || []).map((card) => ({
          ...card,
          bankSlug: bank.slug,
          bankName: bank.name,
        }))
      )
      .slice(0, 6);
  }, [banks]);

  const totalCards = useMemo(
    () => banks.reduce((total, bank) => total + (bank.cards?.length || 0), 0),
    [banks]
  );

  return (
    <>
      <Head>
        <title>CreditCardMarket | Premium Fintech Card Marketplace</title>
        <meta
          name="description"
          content="Compare credit card offers with a premium, trust-first financial experience."
        />
      </Head>

      <Navbar banks={banks} isLoading={isLoading} />
      <main>
        <HeroSection />
        <TrustStatsSection totalCards={totalCards} totalBanks={banks.length} />
        <OffersSection featuredCards={featuredCards} />
        <PartnersSection banks={banks} />
        <BenefitsSection />
        <FAQSection />
        <BlogSection />
        <AppDownloadSection />
      </main>
      <FooterSection />
    </>
  );
}
