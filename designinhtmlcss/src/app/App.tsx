import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import CreditCardSection from './components/CreditCardSection';
import { BenefitsSection } from './components/BenefitsSection';
import { ThingsToKnowSection, DosAndDontsSection } from './components/ThingsToKnowSection';
import { CreditCardVsDebitCardSection } from './components/CreditCardVsDebitCardSection';
import { TypesOfCreditCardsSection } from './components/TypesOfCreditCardsSection';
import { FeesAndChargesSection, InterestRateSection } from './components/FeesAndChargesSection';
import { HowToChooseSection } from './components/HowToChooseSection';
import { EligibilitySection } from './components/EligibilitySection';
import { RupaySection, SecuredCreditCardsSection } from './components/RupayAndSecuredSection';
import { CreditScoreSection } from './components/CreditScoreSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SectionWithSidebar } from './components/SectionWithSidebar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        
        {/* Full-width CreditCardSection */}
        <div id="cards">
          <CreditCardSection />
        </div>
        
        {/* Sections with 8+4 column layout and sticky sidebar - starts from Benefits */}
        <SectionWithSidebar>
          <BenefitsSection />
          <ThingsToKnowSection />
          <DosAndDontsSection />
          <CreditCardVsDebitCardSection />
          <TypesOfCreditCardsSection />
          <FeesAndChargesSection />
          <InterestRateSection />
          <HowToChooseSection />
          <EligibilitySection />
          <RupaySection />
          <SecuredCreditCardsSection />
          <CreditScoreSection />
        </SectionWithSidebar>
        
        {/* Full-width FAQ section */}
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}