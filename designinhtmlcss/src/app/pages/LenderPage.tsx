import { useParams, Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FAQSection } from '../components/FAQSection';
import { creditCardsData } from '../data/creditCardsData';
import HdfcBankLogo from '../../imports/HdfcBankId6PGbXHe01';
import { api, ApiMetaItem, mapApiCardToUi } from '../lib/api';

// Import CreditCard component
function CreditCard({ id, image, title, joiningFee, renewalFee, benefits, categories }: {
  id: string;
  image: string;
  title: string;
  joiningFee: string;
  renewalFee: string;
  benefits: string[];
  categories: string[];
}) {
  const categoryStyles: Record<string, { icon: string; bgColor: string; textColor: string; borderColor: string }> = {
    "Dining": { 
      icon: "🍽️", 
      bgColor: "bg-orange-50", 
      textColor: "text-orange-700", 
      borderColor: "border-orange-200" 
    },
    "Shopping": { 
      icon: "🛍️", 
      bgColor: "bg-pink-50", 
      textColor: "text-pink-700", 
      borderColor: "border-pink-200" 
    },
    "Travel": { 
      icon: "✈️", 
      bgColor: "bg-blue-50", 
      textColor: "text-blue-700", 
      borderColor: "border-blue-200" 
    },
    "Fuel": { 
      icon: "⛽", 
      bgColor: "bg-green-50", 
      textColor: "text-green-700", 
      borderColor: "border-green-200" 
    },
    "Movies": { 
      icon: "🎬", 
      bgColor: "bg-purple-50", 
      textColor: "text-purple-700", 
      borderColor: "border-purple-200" 
    },
    "Lounge Pass": { 
      icon: "🛋️", 
      bgColor: "bg-indigo-50", 
      textColor: "text-indigo-700", 
      borderColor: "border-indigo-200" 
    },
    "Reward Points": { 
      icon: "🎁", 
      bgColor: "bg-amber-50", 
      textColor: "text-amber-700", 
      borderColor: "border-amber-200" 
    },
    "Cashback": { 
      icon: "💰", 
      bgColor: "bg-emerald-50", 
      textColor: "text-emerald-700", 
      borderColor: "border-emerald-200" 
    },
    "Default": { 
      icon: "🏷️", 
      bgColor: "bg-gray-50", 
      textColor: "text-gray-700", 
      borderColor: "border-gray-200" 
    }
  };

  return (
    <div className="group flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
      {/* Card Image Section */}
      <div className="flex flex-col items-center lg:items-start gap-3 flex-shrink-0">
        <div className="w-[200px] sm:w-[240px] h-auto rounded-lg overflow-hidden">
          <img alt={title} className="w-full h-auto" src={image} />
        </div>
        <h3 className="text-body-lg text-black text-center lg:text-left max-w-[200px] sm:max-w-[240px]">
          {title}
        </h3>
      </div>

      {/* Card Details Section */}
      <div className="flex flex-col gap-5 flex-1 w-full">
        {/* Fees Section */}
        <div className="flex flex-row gap-4 sm:gap-8 items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-lg">💰</div>
            <div>
              <p className="text-label text-gray-500">Joining Fee</p>
              <p className="text-body text-black">{joiningFee}</p>
            </div>
          </div>
          
          <div className="flex h-10 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="text-lg">🔄</div>
            <div>
              <p className="text-label text-gray-500">Renewal Fee</p>
              <p className="text-body text-black">{renewalFee}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col gap-3">
          <p className="text-body-lg text-black">
            Key Benefits
          </p>
          <ul className="space-y-2.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                <span className="text-body text-gray-700 leading-relaxed">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section - Categories and Button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category, index) => {
              const style = categoryStyles[category] || categoryStyles["Default"];
              return (
                <div
                  key={index}
                  className={`${style.bgColor} border ${style.borderColor} px-3 py-1.5 rounded-full flex items-center gap-1.5`}
                >
                  <span className="text-sm">{style.icon}</span>
                  <span className={`text-label ${style.textColor}`}>
                    {category}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link 
              to={`/card/${id}`}
              className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 text-button px-6 py-3 rounded-lg transition-all w-full sm:w-auto whitespace-nowrap text-center"
            >
              More Details
            </Link>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-button px-8 py-3 rounded-lg transition-colors w-full sm:w-auto whitespace-nowrap">
              Apply now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock lender data - in production this would come from a database
const lenderData: Record<string, {
  name: string;
  logo: React.ReactNode;
  description: string;
  totalCards: number;
}> = {
  'hdfc': {
    name: 'HDFC Bank',
    logo: <div className="w-32 h-8"><HdfcBankLogo /></div>,
    description: 'HDFC Bank is one of India\'s leading private sector banks, offering a comprehensive range of credit cards designed to suit diverse lifestyle and spending needs. With innovative features, extensive reward programs, and best-in-class customer service, HDFC credit cards deliver exceptional value to cardholders. From travel enthusiasts to shopping lovers, HDFC has a card for everyone. Enjoy exclusive benefits like airport lounge access, cashback offers, reward points, fuel surcharges waivers, and much more. HDFC Bank\'s credit cards are known for their seamless digital experience and wide acceptance across India and abroad.',
    totalCards: 25
  },
  'sbi': {
    name: 'State Bank of India',
    logo: '🏛️',
    description: 'State Bank of India (SBI), India\'s largest public sector bank, offers a wide array of credit cards that combine trust, security, and rewarding benefits. SBI credit cards cater to various customer segments, from first-time users to premium cardholders seeking luxury and convenience. With competitive interest rates, extensive merchant networks, and value-added services, SBI credit cards provide financial flexibility and peace of mind. Whether you\'re looking for travel benefits, shopping rewards, or fuel savings, SBI has carefully crafted credit card solutions. Experience the reliability of India\'s most trusted bank with features like EMI conversions, contactless payments, and comprehensive insurance coverage.',
    totalCards: 18
  },
  'icici': {
    name: 'ICICI Bank',
    logo: '🏢',
    description: 'ICICI Bank, a pioneer in digital banking, offers an impressive portfolio of credit cards packed with innovative features and lifestyle benefits. Known for their technology-driven approach, ICICI credit cards provide seamless integration with mobile banking apps, instant card activation, and real-time transaction alerts. From cashback cards to travel cards, ICICI caters to every spending pattern with rewarding programs. Enjoy exclusive dining privileges, movie discounts, shopping offers, and comprehensive travel insurance. ICICI credit cards are designed for the modern consumer who values convenience, security, and maximum returns on their spending. With features like EMI options, reward point acceleration, and zero lost card liability, ICICI delivers a superior credit card experience.',
    totalCards: 22
  },
  'axis': {
    name: 'Axis Bank',
    logo: '🏦',
    description: 'Axis Bank credit cards are designed to enhance your lifestyle with exclusive privileges and rewarding experiences. With a focus on customer-centric innovation, Axis Bank offers credit cards that deliver exceptional value across travel, dining, shopping, and entertainment. Cardholders enjoy benefits like complimentary airport lounge access, accelerated reward points, fuel surcharge waivers, and exclusive brand partnerships. Axis Bank\'s credit cards feature advanced security measures, easy EMI conversions, and a user-friendly mobile app for seamless card management. Whether you\'re a frequent traveler, a shopping enthusiast, or someone looking for everyday value, Axis Bank has a credit card tailored to your needs.',
    totalCards: 20
  }
};

// Mock card variants data
const cardVariants = [
  {
    variant: 'HDFC Regalia',
    joiningFee: '₹2,500',
    annualFee: '₹2,500',
    bestFor: 'Premium Lifestyle & Travel'
  },
  {
    variant: 'HDFC Millennia',
    joiningFee: '₹1,000',
    annualFee: '₹1,000',
    bestFor: 'Online Shopping & Cashback'
  },
  {
    variant: 'HDFC Diners Club Black',
    joiningFee: '₹10,000',
    annualFee: '₹10,000',
    bestFor: 'Luxury Travel & Dining'
  },
  {
    variant: 'HDFC MoneyBack+',
    joiningFee: '₹500',
    annualFee: '₹500',
    bestFor: 'Everyday Spending'
  },
  {
    variant: 'HDFC Freedom',
    joiningFee: '₹500',
    annualFee: '₹500',
    bestFor: 'Fuel & Groceries'
  }
];

export default function LenderPage() {
  const { lenderId } = useParams<{ lenderId: string }>();
  const [banks, setBanks] = useState<ApiMetaItem[]>([]);
  const [cards, setCards] = useState(creditCardsData);

  const lender = useMemo(() => {
    if (!lenderId) return null;

    const dynamicBank = banks.find((bank) => bank.slug === lenderId || bank.id === lenderId);
    if (dynamicBank) {
      return {
        name: dynamicBank.name,
        logo: dynamicBank.logo_url
          ? <img src={dynamicBank.logo_url} alt={`${dynamicBank.name} logo`} className="h-12 w-auto object-contain" />
          : '🏦',
        description: dynamicBank.description || `${dynamicBank.name} credit cards and offers.`,
        totalCards: 0,
      };
    }

    return lenderData[lenderId] || null;
  }, [banks, lenderId]);

  const allLenders = useMemo(() => {
    if (banks.length) {
      return banks.map((bank) => ({
        id: bank.slug || bank.id,
        name: bank.name,
        logoUrl: bank.logo_url || '',
      }));
    }

    return Object.entries(lenderData).map(([id, value]) => ({
      id,
      name: value.name,
      logoUrl: '',
    }));
  }, [banks]);

  useEffect(() => {
    let active = true;

    const loadCards = async () => {
      try {
        const apiCards = await api.getCards('enabled');
        if (!active || !apiCards.length) return;

        setCards(
          apiCards.map((card) => {
            const uiCard = mapApiCardToUi(card);
            return {
              id: uiCard.slug || uiCard.rawId,
              image: uiCard.image,
              title: uiCard.title,
              joiningFee: uiCard.joiningFee,
              renewalFee: uiCard.renewalFee,
              benefits: uiCard.benefits,
              categories: uiCard.categories,
              description: uiCard.description,
              bankName: uiCard.bankName,
            };
          }) as any
        );
      } catch {
      }
    };

    loadCards();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadBanks = async () => {
      try {
        const bankRows = await api.getBanks();
        if (!active) return;
        setBanks(bankRows);
      } catch {
        if (!active) return;
        setBanks([]);
      }
    };

    loadBanks();
    return () => {
      active = false;
    };
  }, []);

  const filteredCards = useMemo(() => {
    if (!lender) return cards;
    return cards.filter((card: any) => {
      const cardTitle = (card.title || '').toLowerCase();
      const bankName = (card.bankName || '').toLowerCase();
      const lenderName = lender.name.toLowerCase();
      return cardTitle.includes(lenderName) || bankName.includes(lenderName);
    });
  }, [cards, lender]);

  if (!lender) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-h1 text-black mb-4">Lender Not Found</h1>
          <p className="text-body text-gray-600 mb-8">The lender you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-button px-8 py-3 rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <Link to="/" className="text-body-sm text-gray-600 hover:text-purple-600 transition-colors">
            ← Back to all lenders
          </Link>
        </motion.div>

        {/* Section 1: Lender Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#ebf6ff] rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 md:p-12 mb-6 sm:mb-8"
        >
          {/* Mobile Layout - Compact Header */}
          <div className="flex md:hidden flex-col gap-4">
            {/* Logo - Centered */}
            <div className="flex justify-center">
              <div className="w-auto h-auto">{lender.logo}</div>
            </div>
            
            {/* Name and Badge Row - Horizontally Aligned & Centered */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h1 className="text-h2 text-black">
                {lender.name}
              </h1>
              <div className="bg-[#dff0ff] border border-[#95b1ca] rounded-full px-4 py-1.5">
                <span className="text-label text-[#004c8f]">
                  {filteredCards.length || lender.totalCards} CC Available
                </span>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-body text-[#364153] leading-relaxed">
              {lender.description}
            </p>
          </div>

          {/* Desktop Layout - Centered */}
          <div className="hidden md:flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center justify-center">
              <div className="w-auto h-auto">{lender.logo}</div>
            </div>
            
            {/* Bank Name and Badge - Horizontally Aligned */}
            <div className="flex items-center gap-6">
              <h1 className="text-hero text-black">
                {lender.name}
              </h1>
              <div className="bg-[#dff0ff] border border-[#95b1ca] rounded-full px-4 py-1.5">
                <span className="text-body-sm text-[#004c8f]">
                  {filteredCards.length || lender.totalCards} Credit Cards Available
                </span>
              </div>
            </div>
          </div>
          
          {/* Desktop Description */}
          <p className="hidden md:block text-body text-[#364153] leading-relaxed">
            {lender.description}
          </p>
        </motion.div>

        {/* Section 2: Credit Cards Available */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-h1 text-black mb-6">
            Popular {lender.name} Credit Cards
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {filteredCards.map((card: any, index) => (
              <CreditCard key={card.id} id={card.id} image={card.image} title={card.title} joiningFee={card.joiningFee} renewalFee={card.renewalFee} benefits={card.benefits} categories={card.categories} />
            ))}
          </div>
        </motion.div>

        {/* Section 3: How to Apply */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 mb-6 sm:mb-8"
        >
          <div className="mb-8 sm:mb-12">
            <h2 className="text-h1 text-black mb-3">
              How to Apply for {lender.name} Credit Card
            </h2>
            <p className="text-body text-gray-600">
              Follow these simple steps to get your card in just a few days
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 hover:shadow-md transition-all duration-200">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <div className="mt-2">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-h3 text-black mb-3">
                  Check Eligibility
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  Review eligibility criteria: age (21-60 years), minimum income, and CIBIL score (750+). Ensure documents are ready.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 hover:shadow-md transition-all duration-200">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <div className="mt-2">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-h3 text-black mb-3">
                  Choose Your Card
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  Compare card variants based on spending patterns, lifestyle needs, and benefits. Select the best match.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 hover:shadow-md transition-all duration-200">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <div className="mt-2">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-h3 text-black mb-3">
                  Submit Application
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  Fill online form with personal and financial details. Upload PAN, Aadhaar, income proof, and address proof.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 hover:shadow-md transition-all duration-200">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                4
              </div>
              <div className="mt-2">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-h3 text-black mb-3">
                  Verification & Approval
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  Bank verifies documents and conducts credit check. Takes 2-7 working days. Expect a verification call.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 p-6 hover:shadow-md transition-all duration-200">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                5
              </div>
              <div className="mt-2">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-h3 text-black mb-3">
                  Receive Your Card
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  Card dispatched to registered address in 7-10 days. Activate via mobile app or customer care. Start enjoying!
                </p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white flex flex-col justify-center items-center text-center hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-h3 mb-3">
                Ready to Apply?
              </h3>
              <p className="text-body text-white/90 mb-4 leading-relaxed">
                Start your application today and get approved within days
              </p>
              <button className="bg-white text-purple-600 text-button px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                Apply Now →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Fees & Charges Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 md:p-8 mb-6 sm:mb-8"
        >
          <h2 className="text-h1 text-black mb-6">
            {lender.name} Fees & Charges Comparison
          </h2>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-label text-black">CARD VARIANT</th>
                  <th className="text-left p-4 text-label text-black">JOINING FEE</th>
                  <th className="text-left p-4 text-label text-black">ANNUAL FEE</th>
                  <th className="text-left p-4 text-label text-black">BEST FOR</th>
                </tr>
              </thead>
              <tbody>
                {cardVariants.map((variant, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-body text-black">{variant.variant}</td>
                    <td className="p-4 text-body text-gray-700">{variant.joiningFee}</td>
                    <td className="p-4 text-body text-gray-700">{variant.annualFee}</td>
                    <td className="p-4 text-body text-gray-700">{variant.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {cardVariants.map((variant, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-body-lg text-black mb-3">{variant.variant}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-label text-gray-500">Joining Fee:</span>
                    <span className="text-body text-gray-900">{variant.joiningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-label text-gray-500">Annual Fee:</span>
                    <span className="text-body text-gray-900">{variant.annualFee}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-label text-gray-500">Best For:</span>
                    <p className="text-body text-gray-900 mt-1">{variant.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-body-sm text-gray-600 leading-relaxed">
              <span className="text-body text-black">Note:</span> Fees mentioned are subject to change. 
              Annual fees may be waived based on annual spending criteria. GST applicable as per government regulations. 
              Please check the official {lender.name} website for the most current information.
            </p>
          </div>
        </motion.div>

        {/* Section 5: Explore Other Lenders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-12 mb-6 sm:mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-h1 text-black mb-2">
              Explore Cards from Leading Issuers
            </h2>
            
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {allLenders.map((otherLender) => (
              <Link
                key={otherLender.id}
                to={`/lender/${otherLender.id}`}
                className={`group inline-flex items-center gap-2.5 sm:gap-3 bg-white hover:bg-gray-50 border-2 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 transition-all duration-200 hover:shadow-md ${
                  otherLender.id === lenderId 
                    ? 'border-purple-600 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl sm:text-2xl flex-shrink-0">
                  {otherLender.logoUrl ? (
                    <img src={otherLender.logoUrl} alt={`${otherLender.name} logo`} className="h-6 w-auto object-contain" />
                  ) : (
                    '🏦'
                  )}
                </span>
                <span className={`text-label whitespace-nowrap ${
                  otherLender.id === lenderId ? 'text-purple-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {otherLender.name}
                </span>
                {otherLender.id === lenderId && (
                  <span className="inline-flex items-center justify-center w-2 h-2 bg-purple-600 rounded-full ml-1" />
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Section 6: FAQs */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}