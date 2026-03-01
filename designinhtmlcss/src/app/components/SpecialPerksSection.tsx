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
        <h3 className="text-h2">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-2">
        {description ? (
          <p className="text-body-lg text-gray-700 leading-relaxed">{description}</p>
        ) : null}
        
        <ul className="space-y-2 ml-6">
          {bullets.map((bullet, index) => (
            <li key={index} className="list-disc text-body-lg text-gray-700 leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
        
        {note && (
          <div className="mt-2">
            <p className="text-body-lg text-gray-700">
              <span className="text-button text-black">Note:</span>{' '}
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

interface SpecialPerksSectionProps {
  eligibilityCriteria?: string[];
  specialPerks?: string[];
  pros?: string[];
  cons?: string[];
}

export default function SpecialPerksSection({
  eligibilityCriteria = [],
  specialPerks = [],
  pros = [],
  cons = [],
}: SpecialPerksSectionProps) {
  const perks: PerkCardProps[] = [];

  if (specialPerks.length) {
    perks.push({
      title: 'Special Perks & Offers',
      description: '',
      bullets: specialPerks,
    });
  }

  if (eligibilityCriteria.length) {
    perks.push({
      title: 'Eligibility Criteria',
      description: '',
      bullets: eligibilityCriteria,
    });
  }

  if (pros.length) {
    perks.push({
      title: 'Pros',
      description: '',
      bullets: pros,
    });
  }

  if (cons.length) {
    perks.push({
      title: 'Cons',
      description: '',
      bullets: cons,
    });
  }

  if (!perks.length) return null;

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-3 md:p-8 mb-8">
      {/* Section Header */}
      <h2 className="text-h1 mb-6">
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