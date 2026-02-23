import svgPaths from "../../imports/svg-20qdiezk2t";
import imgBobcardPremier from "figma:asset/d326441dbe055cea6b310850b0fa9e9e904edcd5.png";

// Tab Navigation Component
function TabButton({ icon, label, isActive }: { icon: React.ReactNode; label: string; isActive?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-2 px-4 py-3 transition-all rounded-lg ${
      isActive 
        ? 'text-black bg-white border border-gray-200' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`}>
      {icon}
      <span className="font-medium text-sm whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function DynamicFeedIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          <mask height="32" id="mask0_feed" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="32" x="0" y="0">
            <rect fill="#D9D9D9" height="32" width="32" />
          </mask>
          <g mask="url(#mask0_feed)">
            <path d={svgPaths.p645f00} fill="currentColor" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TravelIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p18ce6ac0} fill="currentColor" />
      </svg>
    </div>
  );
}

function ShoppingIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p920cd80} fill="currentColor" />
      </svg>
    </div>
  );
}

function DiningIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p15756680} fill="currentColor" />
      </svg>
    </div>
  );
}

function FuelIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          <mask height="32" id="mask0_fuel" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="32" x="0" y="0">
            <rect fill="#D9D9D9" height="32" width="32" />
          </mask>
          <g mask="url(#mask0_fuel)">
            <path d={svgPaths.p392d6a80} fill="currentColor" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function MoviesIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p24bd8c30} fill="currentColor" />
      </svg>
    </div>
  );
}

function LoungeIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p13a6ed00} fill="currentColor" />
      </svg>
    </div>
  );
}

function RewardIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p2301e580} fill="currentColor" />
      </svg>
    </div>
  );
}

// Credit Card Component
interface CreditCardProps {
  image: string;
  title: string;
  joiningFee: string;
  renewalFee: string;
  benefits: string[];
  categories: string[];
}

// Category Icon and Color Mapping
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

function CreditCard({ image, title, joiningFee, renewalFee, benefits, categories }: CreditCardProps) {
  return (
    <div className="group flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
      {/* Card Image Section */}
      <div className="flex flex-col items-center lg:items-start gap-3 flex-shrink-0">
        <div className="w-[200px] sm:w-[240px] h-auto rounded-lg overflow-hidden">
          <img alt={title} className="w-full h-auto" src={image} />
        </div>
        <h3 className="font-semibold text-base text-black text-center lg:text-left max-w-[200px] sm:max-w-[240px]">
          {title}
        </h3>
      </div>

      {/* Card Details Section */}
      <div className="flex flex-col gap-5 flex-1 w-full">
        {/* Fees Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-lg">💰</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Joining Fee</p>
              <p className="font-semibold text-sm text-black">{joiningFee}</p>
            </div>
          </div>
          
          <div className="hidden sm:flex h-10 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="text-lg">🔄</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Renewal Fee</p>
              <p className="font-semibold text-sm text-black">{renewalFee}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm text-black">
            Key Benefits
          </p>
          <ul className="space-y-2.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                <span className="font-normal text-sm text-gray-700 leading-relaxed">
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
                  <span className={`font-medium text-xs ${style.textColor}`}>
                    {category}
                  </span>
                </div>
              );
            })}
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-colors w-full sm:w-auto whitespace-nowrap">
            Apply now →
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function CreditCardSection() {
  const tabs = [
    { icon: <DynamicFeedIcon />, label: 'All Cards', isActive: false },
    { icon: <TravelIcon />, label: 'Travel', isActive: true },
    { icon: <ShoppingIcon />, label: 'Shopping', isActive: false },
    { icon: <DiningIcon />, label: 'Dining', isActive: false },
    { icon: <FuelIcon />, label: 'Fuel', isActive: false },
    { icon: <MoviesIcon />, label: 'Movies', isActive: false },
    { icon: <LoungeIcon />, label: 'Lounge Pass', isActive: false },
    { icon: <RewardIcon />, label: 'Reward Points', isActive: false },
  ];

  const cards: CreditCardProps[] = [
    {
      image: imgBobcardPremier,
      title: "Bank of Baroda Premier BOBCARD",
      joiningFee: "₹1200",
      renewalFee: "₹1200",
      benefits: [
        "5X Reward Points on online, dining, and travel spends",
        "1% Fuel Surcharge Waiver on fuel transactions between ₹400–₹5,000",
        "500 Bonus Reward Points on spending ₹5,000 within 60 days of card issuance",
      ],
      categories: ["Dining", "Shopping"],
    },
    {
      image: imgBobcardPremier,
      title: "Bank of Baroda Premier BOBCARD",
      joiningFee: "₹1200",
      renewalFee: "₹1200",
      benefits: [
        "5X Reward Points on online, dining, and travel spends",
        "1% Fuel Surcharge Waiver on fuel transactions between ₹400–₹5,000",
        "500 Bonus Reward Points on spending ₹5,000 within 60 days of card issuance",
      ],
      categories: ["Dining", "Shopping"],
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 leading-[1.1] tracking-tight">
            Our Top Picks for You
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Carefully curated credit cards tailored to your lifestyle and spending habits
          </p>
        </div>

        {/* Tabs Navigation - Scrollable on mobile */}
        <div className="mb-12 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-2 md:gap-3 min-w-max justify-center px-2">
            {tabs.map((tab, index) => (
              <TabButton key={index} {...tab} />
            ))}
          </div>
        </div>

        {/* Credit Cards List */}
        <div className="flex flex-col gap-8">
          {cards.map((card, index) => (
            <div key={index}>
              <CreditCard {...card} />
              {index < cards.length - 1 && (
                <div className="h-px w-full bg-gray-200 mt-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}