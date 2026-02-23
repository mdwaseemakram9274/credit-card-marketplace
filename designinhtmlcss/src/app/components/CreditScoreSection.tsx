export function CreditScoreSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto p-[0px]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            How a Credit Card Can Help Improve Your Credit Score
          </h2>
          <p className="text-base text-gray-600 mt-2 mb-12">
            Learn how responsible credit card usage can significantly boost your credit score and financial credibility.
          </p>

          {/* What is Credit Score */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">What is a Credit Score?</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              A credit score is a three-digit number (ranging from 300 to 900) that represents your creditworthiness. In India, credit scores are calculated by credit bureaus like CIBIL, Experian, Equifax, and CRIF High Mark. A score of <strong className="text-black">750 or above is considered excellent</strong>, while below 650 is considered risky by lenders.
            </p>
          </div>

          {/* Credit Score Ranges */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">Credit Score Ranges</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-2">
              Credit scores are categorized into different ranges:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm md:text-base text-gray-700">
              <li><strong>Excellent:</strong> 750-900</li>
              <li><strong>Good:</strong> 700-749</li>
              <li><strong>Fair:</strong> 650-699</li>
              <li><strong>Poor:</strong> 550-649</li>
              <li><strong>Bad:</strong> 300-549</li>
            </ul>
          </div>

          {/* How Credit Cards Help */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">How Credit Cards Improve Your Credit Score</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-black pl-6">
                <h4 className="text-base md:text-lg font-semibold text-black mb-2">1. Establishes Credit History (35% Impact)</h4>
                <p className="text-sm md:text-base text-gray-700">
                  Regular use of a credit card creates a credit history. Lenders need to see a track record of your borrowing and repayment behavior. Without any credit history, it's difficult to get loans or better credit cards.
                </p>
              </div>

              <div className="border-l-4 border-black pl-6">
                <h4 className="text-base md:text-lg font-semibold text-black mb-2">2. Timely Payments Show Responsibility (30% Impact)</h4>
                <p className="text-sm md:text-base text-gray-700">
                  Paying your credit card bill on or before the due date every month demonstrates financial discipline. This is the single most important factor in credit scoring. Even one missed payment can significantly hurt your score.
                </p>
              </div>

              <div className="border-l-4 border-black pl-6">
                <h4 className="text-base md:text-lg font-semibold text-black mb-2">3. Credit Utilization Ratio (25% Impact)</h4>
                <p className="text-sm md:text-base text-gray-700">
                  Keep your credit utilization below 30%. For example, if your credit limit is ₹1,00,000, try to use only ₹30,000 or less. Lower utilization shows you're not credit-hungry and can manage credit responsibly.
                </p>
              </div>

              <div className="border-l-4 border-black pl-6">
                <h4 className="text-base md:text-lg font-semibold text-black mb-2">4. Length of Credit History (15% Impact)</h4>
                <p className="text-sm md:text-base text-gray-700">
                  The longer you maintain a credit card with good payment history, the better your score. Keep your oldest credit card active even if you get newer ones.
                </p>
              </div>

              <div className="border-l-4 border-black pl-6">
                <h4 className="text-base md:text-lg font-semibold text-black mb-2">5. Credit Mix (10% Impact)</h4>
                <p className="text-sm md:text-base text-gray-700">
                  Having a mix of credit types (credit cards, personal loans, home loans) shows you can handle different types of credit. Credit cards are an easy way to diversify your credit portfolio.
                </p>
              </div>
            </div>
          </div>

          {/* How to Improve */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">10 Ways to Improve Your Credit Score</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">💳</span>
                <div>
                  <p className="font-semibold text-black">Pay Full Balance</p>
                  <p className="text-sm md:text-base text-gray-700">Always pay the total amount, not just minimum due</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📅</span>
                <div>
                  <p className="font-semibold text-black">Pay Before Due Date</p>
                  <p className="text-sm md:text-base text-gray-700">Set reminders or auto-pay to never miss deadlines</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <p className="font-semibold text-black">Keep Utilization Low</p>
                  <p className="text-sm md:text-base text-gray-700">Use less than 30% of your credit limit</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🔍</span>
                <div>
                  <p className="font-semibold text-black">Monitor Your Score</p>
                  <p className="text-sm md:text-base text-gray-700">Check your credit report quarterly for errors</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div>
                  <p className="font-semibold text-black">Don't Close Old Cards</p>
                  <p className="text-sm md:text-base text-gray-700">Keep old accounts active for credit age</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div>
                  <p className="font-semibold text-black">Limit New Applications</p>
                  <p className="text-sm md:text-base text-gray-700">Multiple applications in short time hurt score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-black text-white rounded-lg p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Timeline for Score Improvement</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="font-bold text-2xl">3-6</span>
                <div>
                  <p className="font-semibold">Months</p>
                  <p className="text-gray-300 text-sm md:text-base">Start seeing improvements with consistent on-time payments</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-2xl">6-12</span>
                <div>
                  <p className="font-semibold">Months</p>
                  <p className="text-gray-300 text-sm md:text-base">Significant improvement if maintaining low utilization</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-2xl">12+</span>
                <div>
                  <p className="font-semibold">Months</p>
                  <p className="text-gray-300 text-sm md:text-base">Excellent score possible with perfect payment history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}