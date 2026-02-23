export function HowToChooseSection() {
  const factors = [
    {
      title: "Assess Your Spending Patterns",
      description: "Analyze where you spend the most - groceries, fuel, dining, travel, or online shopping. Choose a card that offers maximum rewards in your primary spending categories.",
    },
    {
      title: "Compare Annual Fees vs. Benefits",
      description: "Calculate if the rewards and benefits you'll earn exceed the annual fee. Look for cards with fee waivers based on annual spending thresholds.",
    },
    {
      title: "Check Interest Rates and Fees",
      description: "Compare APR, late payment fees, and other charges across different cards. Even if you plan to pay in full, it's important to know the rates in case of emergencies.",
    },
    {
      title: "Evaluate Reward Programs",
      description: "Look at reward earning rates, redemption options, expiry terms, and conversion ratios. Some cards offer better value for specific categories like travel or dining.",
    },
    {
      title: "Consider Welcome Bonuses",
      description: "Many cards offer sign-up bonuses, cashback, or reward points upon meeting initial spending requirements. This can provide significant value in the first year.",
    },
    {
      title: "Review Credit Limit Offered",
      description: "Ensure the credit limit aligns with your needs. A higher limit can be beneficial for credit utilization ratio but shouldn't encourage overspending.",
    },
    {
      title: "Check Additional Benefits",
      description: "Look for perks like airport lounge access, travel insurance, purchase protection, extended warranties, concierge services, and exclusive partnerships.",
    },
    {
      title: "Verify Acceptance Network",
      description: "Ensure the card is widely accepted. Visa and Mastercard have broader global acceptance, while RuPay is gaining traction domestically.",
    },
    {
      title: "Read Customer Reviews",
      description: "Research user experiences regarding customer service, dispute resolution, reward redemption ease, and overall satisfaction with the bank or issuer.",
    },
    {
      title: "Match Card to Your Credit Score",
      description: "Premium cards require excellent credit scores (750+), while entry-level or secured cards are accessible with lower or no credit history.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="relative">
        <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
          How to Choose the Right Credit Card?
        </h2>
        <p className="text-base text-gray-600 mt-4 mb-16 max-w-3xl">
          Follow these key factors to select a credit card that perfectly matches your financial needs and lifestyle.
        </p>

        {/* Vertical Stack of Cards */}
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <article 
              key={index} 
              className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold text-base text-black">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-black leading-tight pt-1">
                  {factor.title}
                </h3>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">
                {factor.description}
              </p>
            </article>
          ))}
        </div>

        {/* Summary Box */}
        <div className="mt-12 bg-gray-50 border-l-4 border-black p-6 md:p-8 rounded-r-xl">
          <h3 className="text-lg md:text-xl font-semibold text-black mb-6">Quick Selection Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold mb-2 text-base text-black">For Daily Spending:</p>
              <p className="text-gray-700 text-base">Cashback or Rewards cards with no annual fee</p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-base text-black">For Frequent Travelers:</p>
              <p className="text-gray-700 text-base">Travel cards with lounge access and air miles</p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-base text-black">For Building Credit:</p>
              <p className="text-gray-700 text-base">Student or secured credit cards</p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-base text-black">For Luxury Benefits:</p>
              <p className="text-gray-700 text-base">Premium cards with high spending power</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}