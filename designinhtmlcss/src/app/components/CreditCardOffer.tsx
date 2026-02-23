import { Info } from 'lucide-react';

interface CreditCardOfferProps {
  cardImage: string;
  title: string;
  features: {
    icon: string;
    text: string;
    hasInfo?: boolean;
  }[];
  categories: {
    icon: string;
    label: string;
  }[];
}

export function CreditCardOffer({ cardImage, title, features, categories }: CreditCardOfferProps) {
  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-gray-200 hover:border-gray-400 max-w-7xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex gap-8">
        {/* Left Section - Card Image */}
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
          <img 
            src={cardImage} 
            alt="Credit Card" 
            className="w-56 h-auto relative z-10 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Middle Section - Card Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 max-w-2xl group-hover:text-black transition-colors">{title}</h2>
            
            {/* Category Badges */}
            <div className="flex gap-3">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group/feature">
                <span className="text-2xl flex-shrink-0 transform group-hover/feature:scale-110 transition-transform">{feature.icon}</span>
                <span className="text-gray-800 text-base group-hover/feature:text-gray-900 transition-colors">
                  {feature.text}
                </span>
                {feature.hasInfo && (
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 hover:text-blue-600 transition-colors" />
                )}
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-3 cursor-pointer group/checkbox">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-gray-400 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all group-hover/checkbox:border-gray-600">
                  <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5 hidden peer-checked:block" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-gray-900 font-medium group-hover/checkbox:text-black transition-colors">Compare</span>
            </label>

            <div className="flex items-center gap-6">
              <button className="text-gray-900 font-semibold underline underline-offset-4 hover:text-gray-700 transition-colors">
                Read More
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all flex items-center gap-2">
                Check Eligibility
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}