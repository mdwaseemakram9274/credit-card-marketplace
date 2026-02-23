export function EligibilitySection() {
  const eligibilityCriteria = [
    {
      criteria: "Age Requirement",
      details: "Must be between 18 to 65 years (varies by card type and issuer)",
    },
    {
      criteria: "Income Requirement",
      details: "Minimum monthly income: ₹15,000 - ₹25,000 for basic cards; ₹50,000+ for premium cards",
    },
    {
      criteria: "Employment Status",
      details: "Salaried, self-employed, or business owner with stable income source",
    },
    {
      criteria: "Credit Score",
      details: "Minimum 700+ for most cards; 750+ for premium cards; lower for secured cards",
    },
    {
      criteria: "Residential Status",
      details: "Must be a resident Indian citizen (some banks offer for NRIs)",
    },
    {
      criteria: "Credit History",
      details: "Good credit history with no defaults; first-time users can apply for beginner cards",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto p-[0px]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight">
            Eligibility Criteria for Credit Cards
          </h2>
          <p className="text-base text-gray-600 mt-2 mb-12">
            Understand the basic requirements to apply for a credit card in India.
          </p>

          {/* Eligibility Criteria */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibilityCriteria.map((item, index) => (
                <div 
                  key={index} 
                  className="group bg-white border border-gray-200 rounded-2xl p-3 md:p-6 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                >
                  <h4 className="font-semibold text-black mb-2 text-base md:text-lg group-hover:text-gray-900 transition-colors">{item.criteria}</h4>
                  <p className="text-gray-700 text-sm">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-gray-50 border-l-4 border-black p-3 md:p-8 rounded-r-xl">
            <h4 className="text-base md:text-lg font-semibold text-black mb-3">📋 Important Notes</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span>PAN Card is mandatory for all credit card applications in India</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span>Documents must be valid and not expired</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span>Self-attested copies are usually required</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">•</span>
                <span>Additional documents may be requested by the bank during verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}