import svgPaths from "../../imports/svg-20qdiezk2t";
import { Link } from "react-router";
import { creditCardsData, CreditCardData } from "../data/creditCardsData";
import { useEffect, useState } from "react";
import { api, mapApiCardToUi } from "../lib/api";

// Tab Navigation Component
function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 px-4 py-3 transition-all rounded-lg ${
      isActive 
        ? 'text-black bg-white border border-gray-200' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`}>
      {icon}
      <span className="text-button whitespace-nowrap">
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

// Category styles - exported for use in other components
export const categoryStyles: Record<string, { icon: string; bgColor: string; textColor: string; borderColor: string }> = {
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

// Credit Card Component
/**
 * Card Orientation System (Technical Reference)
 *
 * Dual Orientation Support
 * - Supports both horizontal (`16:10`) and vertical (`2:3`) card image layouts.
 * - Orientation is controlled by `cardOrientation` with a default of `horizontal`.
 *
 * Card Image Container System
 * - The image container width remains constant (`w-[200px] sm:w-[240px]`) for all cards.
 * - This keeps content alignment consistent across mixed orientation cards.
 * - The container acts as a stable layout anchor while the image rendering strategy changes.
 *
 * Vertical Card Image Handling
 * - Rendered smaller (`w-[140px] sm:w-[170px]`) inside the same container.
 * - Uses `object-contain` with centered positioning to prevent cropping.
 * - Preserves full artwork visibility while keeping row alignment intact.
 *
 * Horizontal Card Image Handling
 * - Uses full container width (`w-full`) for a wider visual footprint.
 * - Uses `object-cover` for standard card-banner presentation.
 *
 * Fees Section Responsive Alignment
 * - Center-aligned on mobile/tablet: `justify-center`.
 * - Left-aligned on desktop: `lg:justify-start`.
 *
 * Design Goals
 * - Keep card rows visually aligned across orientation variants.
 * - Avoid vertical-image cropping while maintaining proportional sizing.
 * - Preserve responsive readability and consistent information hierarchy.
 */
interface CreditCardProps {
  id: string;
  image: string;
  title: string;
  joiningFee: string;
  renewalFee: string;
  benefits: string[];
  categories: string[];
  cardOrientation?: 'horizontal' | 'vertical';
}

// Export CreditCard component for use in other pages
export function CreditCard({ id, image, title, joiningFee, renewalFee, benefits, categories, cardOrientation = 'horizontal' }: CreditCardProps) {
  const isVertical = cardOrientation === 'vertical';

  return (
    <div className="group flex flex-col lg:flex-row lg:items-start gap-6 md:gap-8 lg:gap-10 w-full bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
      {/* Card Image Section */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-[200px] sm:w-[240px] h-auto rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-[0px]">
          <img
            alt={title}
            className={`h-auto ${isVertical ? 'object-contain w-[140px] sm:w-[170px]' : 'object-cover w-full'}`}
            src={image}
            style={isVertical ? { aspectRatio: '2/3' } : { aspectRatio: '16/10' }}
          />
        </div>
      </div>

      {/* Card Details Section */}
      <div className="flex flex-col gap-5 flex-1 w-full">
        {/* Card Title */}
        <h3 className="text-h3">
          {title}
        </h3>

        {/* Fees Section */}
        <div className="flex flex-row gap-4 sm:gap-8 items-center justify-center lg:justify-start bg-gray-50 rounded-xl p-4 border border-gray-200 w-full">
          <div className="flex items-center gap-3">
            <div className="text-lg">💰</div>
            <div>
              <p className="text-label text-gray-500">Joining Fee</p>
              <p className="text-button text-black">{joiningFee}</p>
            </div>
          </div>
          
          <div className="flex h-10 w-px bg-gray-200" />
          
          <div className="flex items-center gap-3">
            <div className="text-lg">🔄</div>
            <div>
              <p className="text-label text-gray-500">Renewal Fee</p>
              <p className="text-button text-black">{renewalFee}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col gap-3">
          <p className="text-h3">
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
                  <span className={`text-body-sm ${style.textColor}`}>
                    {category}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="text-button border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-all w-full sm:w-auto whitespace-nowrap">
              More Details
            </button>
            <button className="text-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg transition-colors w-full sm:w-auto whitespace-nowrap">
              Apply now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function CreditCardSection() {
  const normalizeLabel = (value: string) => value.trim().toLowerCase();

  const getTabIcon = (label: string) => {
    const normalized = normalizeLabel(label);

    if (normalized.includes('travel')) return <TravelIcon />;
    if (normalized.includes('shop')) return <ShoppingIcon />;
    if (normalized.includes('dining') || normalized.includes('food')) return <DiningIcon />;
    if (normalized.includes('fuel')) return <FuelIcon />;
    if (normalized.includes('movie') || normalized.includes('entertain')) return <MoviesIcon />;
    if (normalized.includes('lounge')) return <LoungeIcon />;
    if (normalized.includes('reward') || normalized.includes('cashback')) return <RewardIcon />;

    return <RewardIcon />;
  };

  const fallbackCards: CreditCardProps[] = creditCardsData.map((card: CreditCardData) => ({
    id: card.id,
    image: card.image,
    title: card.title,
    joiningFee: card.joiningFee,
    renewalFee: card.renewalFee,
    benefits: card.benefits,
    categories: card.categories,
    cardOrientation: card.cardOrientation,
  }));

  const [cards, setCards] = useState<CreditCardProps[]>(fallbackCards);
  const [cardTypeTabs, setCardTypeTabs] = useState<string[]>(
    Array.from(new Set(fallbackCards.flatMap((card) => card.categories))).filter(Boolean)
  );
  const [selectedTab, setSelectedTab] = useState<string>('All Cards');

  const tabs = [
    { icon: <DynamicFeedIcon />, label: 'All Cards', isActive: selectedTab === 'All Cards' },
    ...cardTypeTabs.map((label) => ({
      icon: getTabIcon(label),
      label,
      isActive: selectedTab === label,
    })),
  ];

  const filteredCards =
    selectedTab === 'All Cards'
      ? cards
      : cards.filter((card) =>
          card.categories.some((category) => normalizeLabel(category) === normalizeLabel(selectedTab))
        );

  useEffect(() => {
    let active = true;

    const loadCards = async () => {
      try {
        const [apiCards, typeRows] = await Promise.all([api.getCards('enabled'), api.getCardTypes()]);
        if (!active) return;

        if (apiCards.length) {
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
                cardOrientation: uiCard.cardOrientation,
              };
            })
          );
        }

        const nextTabs = typeRows
          .map((item) => item.name?.trim())
          .filter((name): name is string => Boolean(name));

        if (nextTabs.length) {
          setCardTypeTabs(Array.from(new Set(nextTabs)));
        }
      } catch {
      }
    };

    loadCards();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h1 mb-4">
            Our Top Picks for You
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            Carefully curated credit cards tailored to your lifestyle and spending habits
          </p>
        </div>

        {/* Tabs Navigation - Scrollable on mobile */}
        <div className="mb-12 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-2 md:gap-3 min-w-max justify-center px-2">
            {tabs.map((tab, index) => (
              <TabButton key={index} {...tab} onClick={() => setSelectedTab(tab.label)} />
            ))}
          </div>
        </div>

        {/* Credit Cards List */}
        <div className="flex flex-col gap-8">
          {filteredCards.map((card, index) => (
            <div key={index}>
              <Link to={`/card/${card.id}`} className="block">
                <CreditCard {...card} />
              </Link>
              {index < filteredCards.length - 1 && (
                <div className="h-px w-full bg-gray-200 mt-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}