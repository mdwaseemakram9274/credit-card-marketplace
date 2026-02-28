import { motion } from 'motion/react';
import { CreditCardData } from '../data/creditCardsData';
import { categoryStyles } from './CreditCardSection';

interface LenderCardProps {
  card: CreditCardData;
  index: number;
}

export function LenderCard({ card, index }: LenderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0">
        {/* Left: Card Image */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-[240px] sm:max-w-[260px] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right: Card Details */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          {/* Card Name */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2 leading-tight">
              {card.title}
            </h3>
          </div>

          {/* Fees Section */}
          <div className="flex flex-row gap-3 sm:gap-6 items-center bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-base sm:text-lg">💰</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Joining Fee</p>
                <p className="font-semibold text-sm sm:text-base text-black">{card.joiningFee}</p>
              </div>
            </div>
            
            <div className="flex h-8 sm:h-10 w-px bg-gray-200" />
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-base sm:text-lg">🔄</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Renewal Fee</p>
                <p className="font-semibold text-sm sm:text-base text-black">{card.renewalFee}</p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm sm:text-base text-black mb-3">Key Benefits</h4>
            <ul className="space-y-2">
              {card.benefits.slice(0, 6).map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories & Apply Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {card.categories.map((category, idx) => {
                const style = categoryStyles[category] || categoryStyles["Default"];
                return (
                  <div
                    key={idx}
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
            
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap">
              Apply now →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
