import { useParams, Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SpecialPerksSection from '../components/SpecialPerksSection';
import CardDetailsSection from '../components/CardDetailsSection';
import { FAQSection } from '../components/FAQSection';

// This will be imported from a shared location
import { creditCardsData } from '../data/creditCardsData';
import { categoryStyles } from '../components/CreditCardSection';

export default function CreditCardDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Find the specific card
  const card = creditCardsData.find(c => c.id === cardId);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Card Not Found</h1>
          <p className="text-gray-600 mb-8">The credit card you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
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
          <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors">
            ← Back to all cards
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Left Column - Card Image */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[340px] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img alt={card.title} className="w-full h-auto" src={card.image} />
              </div>
              
              {/* Categories */}
              <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center mt-6 sm:mt-8">
                {card.categories.map((category, index) => {
                  const style = categoryStyles[category] || categoryStyles["Default"];
                  return (
                    <div
                      key={index}
                      className={`${style.bgColor} border ${style.borderColor} px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5`}
                    >
                      <span className="text-xs sm:text-sm">{style.icon}</span>
                      <span className={`font-medium text-[10px] sm:text-xs ${style.textColor}`}>
                        {category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Card Info */}
            <div className="md:col-span-3 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              {/* Powered By */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Powered By</p>
                <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                  <div className="bg-gray-50 border border-gray-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <span className="font-bold text-xs text-blue-600">VISA</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <span className="font-bold text-xs text-orange-500">RuPay</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <span className="font-bold text-xs text-red-600">Mastercard</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 leading-tight">
                  {card.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  {card.description || "Discover the perfect credit card that matches your lifestyle and spending habits."}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200">
                      <span className="text-lg sm:text-xl">💰</span>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Joining Fee</p>
                      <p className="font-semibold text-sm sm:text-base text-black">₹1,200</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200">
                      <span className="text-lg sm:text-xl">🔄</span>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Annual Fee</p>
                      <p className="font-semibold text-sm sm:text-base text-black">₹1,200</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl">
                Apply Now →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card Details Section */}
        <CardDetailsSection />

        {/* Special Perks Section */}
        <SpecialPerksSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Bottom CTA */}
        <div className="bg-gray-50 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto p-[0px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply?</h2>
              <p className="text-base md:text-lg mb-8 opacity-90">
                Get your {card.title} in just a few simple steps
              </p>
              <button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold text-base px-12 py-4 rounded-lg transition-colors shadow-lg">
                Apply Now →
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}