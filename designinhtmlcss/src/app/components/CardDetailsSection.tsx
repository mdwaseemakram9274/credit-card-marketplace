import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface BenefitRow {
  icon: string;
  category: string;
  description: string;
}

interface FeeRow {
  type: string;
  details: string;
}

interface CardDetailsSectionProps {
  rewardsDetails?: {
    rewardsRate?: string;
    rewardRedemption?: string;
    internationalLoungeAccess?: string;
    domesticLoungeAccess?: string;
    insuranceBenefits?: string;
    travelBenefits?: string;
    movieDining?: string;
    golfBenefits?: string;
    cashbackRate?: string;
    customBenefits?: string[];
  };
  productDescription?: string;
  productFeatures?: string[];
  feeItems?: Array<{ feeType: string; amount: string }>;
  feeWaiverConditions?: string;
  interestRate?: string;
}

export default function CardDetailsSection({
  rewardsDetails,
  productDescription,
  productFeatures = [],
  feeItems = [],
  feeWaiverConditions,
  interestRate,
}: CardDetailsSectionProps) {
  // All sections expanded by default for LLM crawlability
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(({
    cardDetails: true,
    rewards: true,
    product: true,
    fees: true,
    perks: true,
  }));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const rewardConfig: Array<{ icon: string; label: string; value?: string }> = [
    { icon: '🎁', label: 'Rewards Rate', value: rewardsDetails?.rewardsRate },
    { icon: '💳', label: 'Reward Redemption', value: rewardsDetails?.rewardRedemption },
    { icon: '✈️', label: 'International Lounge Access', value: rewardsDetails?.internationalLoungeAccess },
    { icon: '🛋️', label: 'Domestic Lounge Access', value: rewardsDetails?.domesticLoungeAccess },
    { icon: '🛡️', label: 'Insurance Benefits', value: rewardsDetails?.insuranceBenefits },
    { icon: '🌍', label: 'Travel', value: rewardsDetails?.travelBenefits },
    { icon: '🎬', label: 'Movie & Dining', value: rewardsDetails?.movieDining },
    { icon: '⛳', label: 'Golf', value: rewardsDetails?.golfBenefits },
    { icon: '💰', label: 'Cashback Rate', value: rewardsDetails?.cashbackRate },
  ];

  const benefitRows: BenefitRow[] = rewardConfig
    .filter((item) => Boolean(item.value && item.value.trim()))
    .map((item) => ({
      icon: item.icon,
      category: item.label,
      description: item.value!.trim(),
    }));

  const customBenefits = (rewardsDetails?.customBenefits || []).filter((item) => item.trim());
  customBenefits.forEach((benefit, index) => {
    benefitRows.push({
      icon: '✨',
      category: `Additional Benefit ${index + 1}`,
      description: benefit,
    });
  });

  const feeRows: FeeRow[] = [];
  if (feeWaiverConditions && feeWaiverConditions.trim()) {
    feeRows.push({
      type: 'Spend-Based Waiver',
      details: feeWaiverConditions.trim(),
    });
  }

  if (interestRate && interestRate.trim()) {
    feeRows.push({
      type: 'Finance Charges',
      details: interestRate.trim(),
    });
  }

  feeItems.forEach((item) => {
    const type = item.feeType?.trim();
    const details = item.amount?.trim();
    if (!type && !details) return;
    feeRows.push({
      type: type || 'Fee',
      details: details || 'N/A',
    });
  });

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
            {benefitRows.length ? (
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
            ) : null}
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
            {productDescription && productDescription.trim() ? (
              <p className="text-base text-gray-700 leading-relaxed">
                {productDescription.trim()}
              </p>
            ) : null}

            {productFeatures.length ? (
              <ul className="space-y-2 ml-6">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="list-disc text-base text-gray-700 leading-relaxed">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
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
            {feeRows.length ? (
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
            ) : null}
          </div>
        </div>
      </div>

      {/* Perks */}
      
    </>
  );
}