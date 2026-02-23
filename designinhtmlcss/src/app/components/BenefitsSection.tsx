import { Shield, Award, Percent, Globe, Wallet } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Cashback and Rewards",
      description: "Earn cashback on everyday purchases and accumulate reward points that can be redeemed for gift vouchers, merchandise, or air miles. Many credit cards offer up to 5% cashback on specific categories like dining, groceries, and fuel.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Financial Security",
      description: "Credit cards provide fraud protection and zero liability on unauthorized transactions. They offer better security than carrying cash and include features like purchase protection, extended warranties, and insurance coverage on travel and shopping.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Build Credit Score",
      description: "Regular usage and timely repayment of credit card bills help build and improve your credit score. A good credit score is essential for future loans, mortgages, and financial opportunities, making credit cards a valuable tool for credit building.",
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: "Interest-Free Credit Period",
      description: "Enjoy up to 45-50 days of interest-free credit on purchases. This helps manage cash flow effectively, allowing you to make purchases now and pay later without any additional charges if paid within the billing cycle.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Acceptance and Travel Benefits",
      description: "Use your credit card worldwide with international acceptance. Premium cards offer complimentary airport lounge access, travel insurance, forex markup waivers, and exclusive hotel and airline partnerships for enhanced travel experiences.",
    },
  ];

  return (
    <section id="benefits" className="py-12 md:py-16">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-10 md:mb-12">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            5 Benefits of Using a Credit Card
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-3 max-w-2xl">
            Discover how credit cards can enhance your financial flexibility and provide valuable rewards and protections.
          </p>
        </div>

        {/* Benefits List - Vertical Stack */}
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-6 md:p-7 transition-all duration-200 cursor-pointer hover:shadow-md"
            >
              {/* Icon and Title Row */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-shrink-0 p-1 md:p-2.5 bg-white rounded-xl">
                  <div className="text-black">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-black">
                  {benefit.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}