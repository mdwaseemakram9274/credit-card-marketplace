export function TypesOfCreditCardsSection() {
  const cardTypes = [
    {
      title: "Cashback Credit Cards",
      description: "Earn cashback on every purchase, typically ranging from 1% to 5% depending on the category. Best for users who prefer direct monetary rewards over points.",
      bestFor: "Everyday purchases, groceries, fuel, and utility bills",
    },
    {
      title: "Rewards Credit Cards",
      description: "Accumulate reward points on every transaction that can be redeemed for gift vouchers, merchandise, or air miles. Often come with accelerated earning on specific categories.",
      bestFor: "Frequent shoppers who want flexibility in reward redemption",
    },
    {
      title: "Travel Credit Cards",
      description: "Designed for frequent travelers with benefits like airport lounge access, air miles, travel insurance, and forex markup waivers. Premium cards offer concierge services and hotel upgrades.",
      bestFor: "Frequent flyers and international travelers",
    },
    {
      title: "Fuel Credit Cards",
      description: "Offer savings and cashback specifically on fuel purchases at petrol pumps, along with waivers on fuel surcharges. Some provide additional rewards on car-related expenses.",
      bestFor: "Daily commuters and vehicle owners",
    },
    {
      title: "Shopping Credit Cards",
      description: "Provide enhanced rewards and discounts on online and offline shopping, especially during sales and festivals. Often partnered with major e-commerce platforms.",
      bestFor: "Online shoppers and retail enthusiasts",
    },
    {
      title: "Premium/Luxury Credit Cards",
      description: "High-end cards with exclusive benefits like golf privileges, fine dining offers, personal concierge services, and comprehensive insurance coverage. Come with higher annual fees.",
      bestFor: "High-income individuals seeking luxury experiences",
    },
    {
      title: "Business Credit Cards",
      description: "Tailored for business expenses with features like expense tracking, employee cards, higher credit limits, and business-specific rewards on office supplies and travel.",
      bestFor: "Entrepreneurs and business professionals",
    },
    {
      title: "Student Credit Cards",
      description: "Entry-level cards designed for students with lower credit limits and minimal documentation. Help young adults build credit history early.",
      bestFor: "College students and young professionals starting their credit journey",
    },
    {
      title: "Secured Credit Cards",
      description: "Require a fixed deposit as collateral and are ideal for building or rebuilding credit. The credit limit is usually a percentage of the FD amount.",
      bestFor: "Individuals with no credit history or poor credit scores",
    },
    {
      title: "Co-branded Credit Cards",
      description: "Partnership cards between banks and brands (airlines, retailers, hotels) offering exclusive discounts and loyalty benefits with the partner brand.",
      bestFor: "Loyal customers of specific brands or retailers",
    },
  ];

  return (
    <section id="types" className="py-20 md:py-32">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Types of Credit Cards
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-3xl">
            Choose the right credit card type based on your lifestyle, spending habits, and financial goals.
          </p>
        </div>

        {/* Cards Vertical Stack */}
        <div className="space-y-4">
          {cardTypes.map((cardType, index) => (
            <article 
              key={index} 
              className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-3 md:p-8 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-base font-semibold text-black">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <h3 className="text-xl font-semibold text-black leading-tight pt-1">
                  {cardType.title}
                </h3>
              </div>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                {cardType.description}
              </p>
              <div className="bg-white border-l-4 border-black rounded-r-lg p-3 md:p-4">
                <p className="text-xs text-gray-500 font-semibold mb-1">BEST FOR</p>
                <p className="text-sm text-gray-900 font-medium">{cardType.bestFor}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}