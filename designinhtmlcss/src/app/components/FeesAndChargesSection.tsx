export function FeesAndChargesSection() {
  const fees = [
    {
      particular: "Annual Fee",
      charges: "Varies from card to card",
    },
    {
      particular: "Finance Charges",
      charges: "9% p.a. to 52.86% p.a.",
    },
    {
      particular: "Interest-free Period",
      charges: "Up to 50 days",
    },
    {
      particular: "Cash Advance Charges",
      charges: "0% to 3.5%",
    },
    {
      particular: "Forex Markup Fee",
      charges: "0% to 3.5%",
    },
    {
      particular: "Late Payment Fee",
      charges: "₹100 - ₹1,300",
    },
    {
      particular: "Over-Limit Fee",
      charges: "₹500 - ₹600",
    },
    {
      particular: "GST on Fees",
      charges: "18% on all fees",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Credit Card Fees and Charges
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-3xl">
            Understand all the fees associated with credit cards to avoid unexpected charges.
          </p>
        </div>

        {/* Fees Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-black text-white">
            <div className="p-3 md:p-6 font-semibold text-base md:text-lg">
              Particular
            </div>
            <div className="p-3 md:p-6 font-semibold text-base md:text-lg border-l border-gray-700">
              Charges
            </div>
          </div>

          {/* Table Rows */}
          {fees.map((fee, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 border-t border-gray-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-white'
                } hover:bg-gray-50 transition-colors duration-200`}
            >
              <div className="p-3 md:p-6 text-sm md:text-base text-gray-900">
                {fee.particular}
              </div>
              <div className="p-3 md:p-6 text-sm md:text-base text-gray-700 border-l border-gray-200">
                {fee.charges}
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="mt-8 bg-gray-50 border-l-4 border-black p-6 md:p-8 rounded-r-xl">
          <div>
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl">
                💡
              </div>
              <h4 className="text-base md:text-lg font-semibold text-black">
                Important Note
              </h4>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              Always read the terms and conditions carefully before applying for a credit card. Many fees can be avoided by responsible usage such as paying bills on time, staying within your credit limit, and meeting annual spending requirements for fee waivers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InterestRateSection() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
        Credit Card Interest Rate
      </h2>
      <p className="text-base text-gray-600 mt-4 mb-12 max-w-3xl">
        Understanding how interest rates work on credit cards and how to minimize interest charges.
      </p>

      <div className="space-y-4">
        {/* APR Explanation */}
        <div className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-semibold text-black mb-4">Annual Percentage Rate (APR)</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            The Annual Percentage Rate (APR) on credit cards in India typically ranges from <strong className="text-black">24% to 52% per annum</strong>, which translates to approximately <strong className="text-black">2% to 4% per month</strong>. This is one of the highest interest rates among all credit products.
          </p>
          <div className="bg-gray-50 border-l-4 border-black p-4 rounded-r-lg">
            <p className="text-base text-gray-700">
              <strong className="text-black">Example:</strong> If you have an outstanding balance of ₹50,000 at 36% APR (3% monthly), you'll pay ₹1,500 in interest charges for that month alone if you don't pay off the balance.
            </p>
          </div>
        </div>

        {/* Interest-Free Period */}
        <div className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-semibold text-black mb-4">Interest-Free Period</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Most credit cards offer an interest-free period of <strong className="text-black">45 to 50 days</strong> from the date of purchase if you pay the total outstanding amount in full by the due date. No interest is charged during this period, making it a great way to manage cash flow.
          </p>
        </div>

        {/* When Interest is Charged */}
        <div className="group bg-white hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-semibold text-black mb-4">When is Interest Charged?</h3>
          <ul className="space-y-3 text-base text-gray-700">
            <li className="flex gap-3 items-start">
              <span className="text-black font-bold mt-0.5">•</span>
              <span>When you pay only the minimum amount due instead of the total outstanding</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-black font-bold mt-0.5">•</span>
              <span>When you make a cash withdrawal (interest starts immediately)</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-black font-bold mt-0.5">•</span>
              <span>When you miss the payment due date</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-black font-bold mt-0.5">•</span>
              <span>On balance transfers if not under a promotional period</span>
            </li>
          </ul>
        </div>

        {/* How to Avoid Interest */}
        <div className="bg-black text-white rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-4">How to Avoid Interest Charges</h3>
          <ul className="space-y-3 text-base text-gray-100">
            <li className="flex gap-3 items-start">
              <span className="font-bold text-white">1.</span>
              <span>Always pay the full outstanding amount before the due date</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="font-bold text-white">2.</span>
              <span>Never withdraw cash using your credit card</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="font-bold text-white">3.</span>
              <span>Set up automatic payments to never miss due dates</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="font-bold text-white">4.</span>
              <span>Use credit cards only for purchases you can afford to pay off</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}