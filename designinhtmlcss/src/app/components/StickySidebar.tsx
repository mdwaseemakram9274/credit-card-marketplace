export function StickySidebar() {
  const partners = [
    "HDFC Bank", "ICICI Bank", "SBI Card", "Axis Bank", 
    "Kotak Mahindra", "IndusInd Bank", "YES Bank", "RBL Bank"
  ];

  return (
    <div className="lg:sticky lg:top-8 pt-20 md:pt-32">
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="text-lg md:text-xl font-bold text-black mb-2">
          Explore Our Credit Card Partners
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Compare cards from India's leading banks and find the perfect match for your needs.
        </p>

        {/* Partner Banks Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="group bg-white border border-gray-100 rounded-lg p-3 text-center hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
            >
              <p className="text-xs font-semibold text-black group-hover:text-purple-600 transition-colors">{partner}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm">
          Compare All Cards →
        </button>

        {/* Additional Info */}
        
      </div>
    </div>
  );
}