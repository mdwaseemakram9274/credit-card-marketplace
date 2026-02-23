import { CheckCircle, XCircle } from 'lucide-react';

export function ThingsToKnowSection() {
  const thingsToKnow = [
    "Understand the annual percentage rate (APR) and interest charges on outstanding balances.",
    "Check for annual fees, joining fees, and renewal charges before applying.",
    "Review the credit limit offered and ensure it matches your spending needs.",
    "Read the terms and conditions carefully, especially regarding late payment penalties.",
    "Verify if there are any forex markup charges for international transactions.",
    "Check the reward point redemption process and expiry dates.",
    "Understand the billing cycle and payment due dates to avoid late fees.",
    "Be aware of the minimum amount due versus total amount due to avoid debt accumulation.",
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Things to Know About Credit Cards
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-3xl">
            Essential information every credit card holder should understand for smart financial management.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12">
          <ul className="space-y-5">
            {thingsToKnow.map((item, index) => (
              <li key={index} className="flex gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm md:text-base text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DosAndDontsSection() {
  const dosAndDonts = [
    {
      do: "Pay your credit card bill on time every month to avoid interest and late fees.",
      dont: "Don't pay only the minimum due amount; always try to pay the full balance."
    },
    {
      do: "Keep your credit utilization ratio below 30% for a healthy credit score.",
      dont: "Don't max out your credit limit; it negatively affects your credit utilization ratio."
    },
    {
      do: "Review your credit card statements regularly to spot unauthorized transactions.",
      dont: "Don't ignore credit card statements; review them for errors or fraudulent charges."
    },
    {
      do: "Set up automatic payments or reminders to never miss a due date.",
      dont: "Don't apply for multiple credit cards simultaneously as it impacts your credit score."
    },
    {
      do: "Use your credit card for planned purchases and emergencies only.",
      dont: "Don't use credit cards for cash withdrawals as they attract high interest rates."
    },
    {
      do: "Redeem reward points before they expire to maximize benefits.",
      dont: "Don't share your CVV, PIN, or OTP with anyone, including bank representatives."
    }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="relative">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Do's and Don'ts for Credit Cards
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mt-4 max-w-3xl">
            Best practices and common pitfalls to avoid when using credit cards.
          </p>
        </div>

        {/* Combined Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-black">
            <div className="p-3 md:p-6 flex items-center gap-3 border-r border-gray-700">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">Do's</h3>
            </div>
            <div className="p-3 md:p-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">Don't</h3>
            </div>
          </div>

          {/* Table Body */}
          {dosAndDonts.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 ${
                index % 2 === 0 ? 'bg-white' : 'bg-white'
              } border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200`}
            >
              {/* Do Column */}
              <div className="p-3 md:p-6 border-r border-gray-200">
                <div className="flex gap-4 items-start">
                  <span className="text-green-600 font-bold text-xl flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-base text-gray-700 leading-relaxed">{item.do}</span>
                </div>
              </div>

              {/* Don't Column */}
              <div className="p-3 md:p-6">
                <div className="flex gap-4 items-start">
                  <span className="text-red-600 font-bold text-xl flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-base text-gray-700 leading-relaxed">{item.dont}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 bg-gray-50 border-l-4 border-black p-6 rounded-r-xl">
          <p className="text-base text-gray-700 leading-relaxed">
            <strong className="text-black">Remember:</strong> Responsible credit card usage is key to building a strong credit history and maximizing benefits. Always spend within your means and treat your credit card as a convenience tool, not as extra income.
          </p>
        </div>
      </div>
    </section>
  );
}