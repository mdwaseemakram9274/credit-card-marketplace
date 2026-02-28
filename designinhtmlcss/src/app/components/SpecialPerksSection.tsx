interface PerkCardProps {
  title: string;
  description: string;
  bullets: string[];
  note?: {
    label: string;
    text: string;
    linkText?: string;
  };
}

function PerkCard({ title, description, bullets, note }: PerkCardProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header with blue accent bar */}
      <div className="bg-gray-50 flex gap-3 items-center rounded-lg p-3 border border-gray-200">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-10 rounded-sm w-1 flex-shrink-0" />
        <h3 className="font-semibold text-lg text-black">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-2">
        <p className="text-base text-gray-700 leading-relaxed">{description}</p>
        
        <ul className="space-y-2 ml-6">
          {bullets.map((bullet, index) => (
            <li key={index} className="list-disc text-base text-gray-700 leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
        
        {note && (
          <div className="mt-2">
            <p className="text-base text-gray-700">
              <span className="font-semibold text-black">Note:</span>{' '}
              {note.text}
              {note.linkText && (
                <span className="text-purple-600 underline cursor-pointer"> {note.linkText}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpecialPerksSection() {
  const perks: PerkCardProps[] = [
    {
      title: "Welcome Gift",
      description: "Kickstart your card journey with a special reward when you make your first transaction.",
      bullets: [
        "Get a ₹250 Amazon voucher on your first spend within 30 days",
        "Offer valid only for new cardholders",
        "No minimum spend required"
      ]
    },
    {
      title: "Weekend Shopping Offer",
      description: "Enjoy exclusive discounts on your favorite brands every weekend.",
      bullets: [
        "10% off on Myntra every Saturday and Sunday",
        "Max discount ₹300, min spend ₹999.",
        "No coupon needed — discount auto-applies at checkout"
      ]
    },
    {
      title: "Eligibility Criteria",
      description: "To apply for this credit card, you must meet the following:",
      bullets: [
        "Age: 21 to 65 years.",
        "Income: Minimum Income: ₹35,000/month (may vary by card)",
        "CIBIL Score: 720+ preferred",
        "Documents Required: PAN Card, Aadhaar Card, Salary Slip / ITR, Address Proof."
      ],
      note: {
        label: "Note",
        text: "Check Eligibility on",
        linkText: "IndiaLends – No impact on credit score!"
      }
    }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mb-8">
      {/* Section Header */}
      <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
        Special Perks You Shouldn't Miss
      </h2>
      
      {/* Perks Grid */}
      <div className="flex flex-col gap-6">
        {perks.map((perk, index) => (
          <PerkCard key={index} {...perk} />
        ))}
      </div>
    </section>
  );
}