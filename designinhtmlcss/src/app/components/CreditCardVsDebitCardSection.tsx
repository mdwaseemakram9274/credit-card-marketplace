export function CreditCardVsDebitCardSection() {
  const comparisons = [
    {
      feature: "Source of Funds",
      creditCard: "Borrowed money from the bank (credit limit)",
      debitCard: "Your own money from your bank account",
    },
    {
      feature: "Payment Timing",
      creditCard: "Pay later (billing cycle)",
      debitCard: "Pay immediately (real-time deduction)",
    },
    {
      feature: "Interest Charges",
      creditCard: "Yes, if balance not paid in full",
      debitCard: "No interest charges",
    },
    {
      feature: "Credit Score Impact",
      creditCard: "Helps build credit history and score",
      debitCard: "No impact on credit score",
    },
    {
      feature: "Rewards & Cashback",
      creditCard: "Extensive rewards, cashback, and benefits",
      debitCard: "Limited or no rewards",
    },
    {
      feature: "Overspending Risk",
      creditCard: "Higher risk (can spend beyond means)",
      debitCard: "Lower risk (limited to account balance)",
    },
    {
      feature: "International Usage",
      creditCard: "Widely accepted globally with benefits",
      debitCard: "Accepted but with limited benefits",
    },
    {
      feature: "Fraud Protection",
      creditCard: "Stronger protection and zero liability",
      debitCard: "Basic protection, may have liability",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Credit Card vs Debit Card: Key Differences
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-3xl">
            Understanding the fundamental differences between credit and debit cards helps you choose the right payment method.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-black text-white">
            <div className="p-3 md:p-6 font-semibold text-sm md:text-base">Feature</div>
            <div className="p-3 md:p-6 font-semibold text-sm md:text-base border-l border-gray-700">Credit Card</div>
            <div className="p-3 md:p-6 font-semibold text-sm md:text-base border-l border-gray-700">Debit Card</div>
          </div>

          {/* Table Body */}
          {comparisons.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 ${
                index % 2 === 0 ? 'bg-white' : 'bg-white'
              } border-t border-gray-200 hover:bg-gray-50 transition-colors`}
            >
              <div className="p-3 md:p-6 font-semibold text-sm text-black">{item.feature}</div>
              <div className="p-3 md:p-6 text-sm text-gray-700 border-l border-gray-200">{item.creditCard}</div>
              <div className="p-3 md:p-6 text-sm text-gray-700 border-l border-gray-200">{item.debitCard}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gray-50 border-l-4 border-black p-6 md:p-8 rounded-r-xl">
          <div>
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl">
                💡
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-black">Bottom Line</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              Credit cards are ideal for building credit, earning rewards, and managing large purchases with payment flexibility. Debit cards are better for daily spending control and avoiding debt. Many people benefit from using both strategically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}