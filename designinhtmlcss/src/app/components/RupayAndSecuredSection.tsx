export function RupaySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto p-[0px]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            RuPay Credit Cards on UPI
          </h2>
          <p className="text-base text-gray-600 mt-2 mb-12">
            Link your RuPay credit card to UPI and enjoy seamless digital payments across millions of merchants.
          </p>

          {/* What is RuPay */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">What are RuPay Credit Cards?</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              RuPay is India's indigenous card payment network launched by the National Payments Corporation of India (NPCI). RuPay credit cards combine the benefits of traditional credit cards with the convenience of UPI (Unified Payments Interface), making them uniquely powerful for digital transactions in India.
            </p>
          </div>

          {/* UPI Integration */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">RuPay Credit Cards on UPI</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              Since 2022, NPCI has enabled linking RuPay credit cards to UPI apps like Google Pay, PhonePe, Paytm, and BHIM. This revolutionary feature allows you to make UPI payments using your credit card instead of your bank account, giving you access to credit while making everyday digital payments.
            </p>
          </div>

          {/* Benefits */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">Key Benefits</h3>
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span className="text-gray-700">
                  <strong className="text-black">Pay via UPI:</strong> Use your credit card for UPI payments at any merchant accepting UPI
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span className="text-gray-700">
                  <strong className="text-black">Earn Rewards:</strong> Get reward points and cashback on UPI transactions made with your credit card
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span className="text-gray-700">
                  <strong className="text-black">Interest-Free Credit:</strong> Enjoy 45-50 days interest-free period on UPI payments
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span className="text-gray-700">
                  <strong className="text-black">Wide Acceptance:</strong> Use at millions of UPI merchants across India
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span className="text-gray-700">
                  <strong className="text-black">Lower Charges:</strong> RuPay cards typically have lower merchant fees and forex charges
                </span>
              </li>
            </ul>
          </div>

          {/* How to Link */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">How to Link RuPay Credit Card to UPI</h3>
            <ol className="space-y-3 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="text-black font-bold">1.</span>
                <span className="text-gray-700">Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">2.</span>
                <span className="text-gray-700">Go to Payment Methods or Bank Accounts section</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">3.</span>
                <span className="text-gray-700">Select "Add Credit Card" or "Link Credit Card"</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">4.</span>
                <span className="text-gray-700">Enter your RuPay credit card details</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">5.</span>
                <span className="text-gray-700">Verify with OTP sent to your registered mobile number</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">6.</span>
                <span className="text-gray-700">Set UPI PIN for the credit card</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">7.</span>
                <span className="text-gray-700">Start making UPI payments using your credit card</span>
              </li>
            </ol>
          </div>

          {/* Popular RuPay Cards */}
          <div className="bg-black text-white rounded-lg p-3 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Popular RuPay Credit Cards</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>HDFC Bank RuPay Credit Card</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>SBI RuPay Credit Card</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Axis Bank RuPay Credit Card</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>ICICI Bank RuPay Credit Card</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Bank of Baroda RuPay Credit Card</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SecuredCreditCardsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto p-[0px]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Secured Credit Cards: A Smart Way to Build Credit
          </h2>
          <p className="text-base text-gray-600 mt-2 mb-12">
            Start your credit journey or rebuild your credit score with secured credit cards backed by your fixed deposit.
          </p>

          {/* What are Secured Cards */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">What are Secured Credit Cards?</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Secured credit cards are special credit cards that require you to deposit a fixed amount (Fixed Deposit) with the bank as collateral. Your credit limit is typically 75% to 100% of your FD amount. These cards are ideal for individuals with no credit history or those looking to rebuild a damaged credit score.
            </p>
          </div>

          {/* How They Work */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">How Do Secured Credit Cards Work?</h3>
            <ol className="space-y-3 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="text-black font-bold">1.</span>
                <span className="text-gray-700">Open a fixed deposit with the bank (typically ₹10,000 to ₹5,00,000)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">2.</span>
                <span className="text-gray-700">Apply for a secured credit card against this FD</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">3.</span>
                <span className="text-gray-700">Get a credit limit based on FD amount (usually 75%-100%)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">4.</span>
                <span className="text-gray-700">Use the card like a regular credit card and pay bills on time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">5.</span>
                <span className="text-gray-700">Your FD continues to earn interest during this period</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">6.</span>
                <span className="text-gray-700">Build credit history and improve your credit score</span>
              </li>
            </ol>
          </div>

          {/* Benefits */}
          <div className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-8 mb-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4">Benefits of Secured Credit Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">Easy Approval</h4>
                <p className="text-sm md:text-base text-gray-700">No credit history or income proof required in most cases</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">Build Credit Score</h4>
                <p className="text-sm md:text-base text-gray-700">Establish or improve your credit history with responsible usage</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">Earn Interest on FD</h4>
                <p className="text-sm md:text-base text-gray-700">Your fixed deposit continues to earn interest</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">Upgrade to Regular Card</h4>
                <p className="text-sm md:text-base text-gray-700">After 6-12 months, upgrade to unsecured card</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">All Card Benefits</h4>
                <p className="text-sm md:text-base text-gray-700">Access to rewards, cashback, and offers</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h4 className="font-semibold text-black mb-2 text-base md:text-lg">Low Risk</h4>
                <p className="text-sm md:text-base text-gray-700">Collateral protects both you and the bank</p>
              </div>
            </div>
          </div>

          {/* Who Should Apply */}
          <div className="bg-black text-white rounded-lg p-3 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Who Should Apply for Secured Credit Cards?</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Students or young professionals with no credit history</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Individuals with low or damaged credit scores</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Self-employed professionals unable to provide income proof</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Anyone wanting to rebuild their credit profile</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Those who have been rejected for regular credit cards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}