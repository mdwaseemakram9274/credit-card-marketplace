import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface BenefitRow {
  icon: string;
  category: string;
  description: string;
}

export default function CardDetailsSection({ eligibilityCriteria = [] }: { eligibilityCriteria?: string[] }) {
  // All sections expanded by default for LLM crawlability
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(({
    cardDetails: true,
    rewards: true,
    product: true,
    eligibility: true,
    fees: true,
    perks: true,
  }));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const benefitRows: BenefitRow[] = [
    {
      icon: "🎁",
      category: "Rewards Rate",
      description: "4 points per ₹150 spent — save up to 1.3% on every transaction"
    },
    {
      icon: "💳",
      category: "Reward Redemption",
      description: "You can redeem reward points for air tickets and AirMiles (1 RP = 0.50 Air Mile) on select airlines. Use SmartBuy for flights/hotels (1 RP = ₹0.50), products/vouchers (up to ₹0.35), or cashback (₹0.20)."
    },
    {
      icon: "✈️",
      category: "International Lounge Access",
      description: "N/A"
    },
    {
      icon: "🛋️",
      category: "Domestic Lounge Access",
      description: "6 complimentary visits per year"
    },
    {
      icon: "🛡️",
      category: "Insurance Benefits",
      description: "Air accident cover of ₹1 Cr + medical and baggage insurance"
    },
    {
      icon: "🌍",
      category: "Travel",
      description: "Access to 1,000+ global lounges + bonus points on bookings"
    },
    {
      icon: "🎬",
      category: "Movie & Dining",
      description: "N/A"
    },
    {
      icon: "⛳",
      category: "Golf",
      description: "N/A"
    }
  ];

  const feeRows = [
    { type: "Spend-Based Waiver", details: "Waived on ₹2L annual spend" },
    { type: "Finance Charges", details: "3.5% p.m. (42% p.a.)" },
    { type: "Late Payment Charges", details: "₹500 or less + No late fee\n₹501-₹5,000 + ₹400 late fee\n₹5,001-₹10,000 + ₹500 late fee\n₹10,001-₹20,000 + ₹750 late fee\nAbove ₹20,000 + ₹950 late fee" },
    { type: "Foreign Currency Markup", details: "3.5% + GST" },
    { type: "Overlimit Fee", details: "3% of overlimit amount" },
    { type: "Cash Advance Charges", details: "2.5% or ₹500 (whichever is higher)" },
    { type: "Rewards Redemption Fee", details: "N/A" }
  ];

  const perksList = [
    "Welcome bonus: 500 reward points on first use",
    "Complimentary railway lounge access (4 times per year)",
    "Extra reward points on IRCTC bookings (up to 40 points per ₹100)",
    "Priority customer service and dedicated support",
    "Exclusive offers on travel and lifestyle partners"
  ];

  return (
    <>
      {/* Card Details */}
      

      {/* Rewards & Benefits */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mx-[0px] mt-[0px] mb-[32px]">
        <button
          onClick={() => toggleSection('rewards')}
          className="flex items-center justify-between w-full group m-[0px]"
          aria-expanded={expandedSections.rewards}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black">Rewards & Benefits</h2>
          <ChevronDown 
            className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.rewards ? 'rotate-180' : ''}`}
          />
        </button>
        
        {/* Always render content for LLM crawling, but visually collapse it */}
        <div className={`overflow-hidden transition-all duration-300 ${
          expandedSections.rewards ? 'mx-[0px] mt-[24px] mb-[0px] max-h-[5000px]' : 'max-h-0'
        }`}>
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 hidden md:grid md:grid-cols-[2fr_3fr] gap-6">
              <p className="font-medium text-base text-black">Rewards Category</p>
              <p className="font-medium text-base text-black">Description</p>
            </div>
            
            {/* Rows */}
            <div className="space-y-4">
              {benefitRows.map((row, index) => (
                <div 
                  key={index} 
                  className="border-b border-gray-200 pb-4 last:border-0 md:grid md:grid-cols-[2fr_3fr] gap-6 flex flex-col"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                      <span className="text-lg">{row.icon}</span>
                    </div>
                    <p className="font-medium text-base text-black">{row.category}</p>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed md:pt-2">
                    {row.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mb-8">
        <button
          onClick={() => toggleSection('product')}
          className="flex items-center justify-between w-full mb-6 group"
          aria-expanded={expandedSections.product}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black">Product Details</h2>
          <ChevronDown 
            className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.product ? 'rotate-180' : ''}`}
          />
        </button>
        
        {/* Always render content for LLM crawling, but visually collapse it */}
        <div className={`overflow-hidden transition-all duration-300 ${
          expandedSections.product ? 'max-h-[5000px]' : 'max-h-0'
        }`}>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              This co-branded credit card by BOB and IRCTC is tailored for frequent train travelers and everyday spenders. 
              Backed by RuPay, it ensures wide acceptance and seamless transactions.
            </p>
            
            <ul className="space-y-2 ml-6">
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                500 Bonus Reward Points as a welcome benefit.
              </li>
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                4 Reward Points per Rs. 100 you spend on grocery & departmental store purchases.
              </li>
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                2 Reward Points per Rs. 100 you spend on other categories.
              </li>
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                Upto 40 Reward Points per Rs. 100 spent on train bookings via the IRCTC website and mobile application.
              </li>
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                Get an add-on card and enjoy added benefits.
              </li>
              <li className="list-disc text-base text-gray-700 leading-relaxed">
                Get four complimentary partner railway lounge access per year.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mb-8">
        <button
          onClick={() => toggleSection('eligibility')}
          className="flex items-center justify-between w-full mb-6 group"
          aria-expanded={expandedSections.eligibility}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black">Eligibility Criteria</h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.eligibility ? 'rotate-180' : ''}`}
          />
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${
          expandedSections.eligibility ? 'max-h-[5000px]' : 'max-h-0'
        }`}>
          {eligibilityCriteria.length > 0 ? (
            <ul className="space-y-2 ml-6">
              {eligibilityCriteria.map((item, index) => (
                <li key={index} className="list-disc text-base text-gray-700 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-gray-600 leading-relaxed">Eligibility criteria will be updated soon.</p>
          )}
        </div>
      </div>

      {/* Fees & Charges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mb-8">
        <button
          onClick={() => toggleSection('fees')}
          className="flex items-center justify-between w-full mb-6 group"
          aria-expanded={expandedSections.fees}
        >
          <h2 className="text-xl md:text-2xl font-semibold text-black">Fees & Charges</h2>
          <ChevronDown 
            className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.fees ? 'rotate-180' : ''}`}
          />
        </button>
        
        {/* Always render content for LLM crawling, but visually collapse it */}
        <div className={`overflow-hidden transition-all duration-300 ${
          expandedSections.fees ? 'max-h-[5000px]' : 'max-h-0'
        }`}>
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 hidden md:grid md:grid-cols-2 gap-6">
              <p className="font-medium text-base text-black">Fee type</p>
              <p className="font-medium text-base text-black">Amount / Details</p>
            </div>
            
            {/* Rows */}
            <div className="space-y-4">
              {feeRows.map((row, index) => (
                <div 
                  key={index} 
                  className="border-b border-gray-200 pb-4 last:border-0 md:grid md:grid-cols-2 gap-6 flex flex-col"
                >
                  <p className="font-medium text-base text-black">{row.type}</p>
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {row.details}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-black">Note:</span> Finance Charges are the interest applied on the unpaid 
                balance if you don't pay your total bill by the due date. It is calculated monthly but shown as an annual 
                percentage rate (APR).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Perks */}
      
    </>
  );
}