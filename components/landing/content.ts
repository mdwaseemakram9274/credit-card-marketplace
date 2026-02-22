export type LinkItem = {
  label: string;
  href: string;
};

export const landingContent = {
  navbar: {
    brand: 'CreditCardMarket',
    links: [
      { label: 'Offers', href: '#offers' },
      { label: 'Benefits', href: '#benefits' },
      { label: 'FAQ', href: '#faq' },
    ] as LinkItem[],
    banksMenuLabel: 'Banks',
    loginCta: { label: 'Login', href: '/admin.html' },
    primaryCta: { label: 'Check Eligibility', href: '#offers' },
    loadingBanks: 'Loading banks...',
    noBanks: 'No banks available',
  },
  hero: {
    eyebrow: 'Bank-grade card recommendations',
    title: 'Better credit card decisions for financially serious users.',
    description:
      'Compare verified card offers, understand fee structures, and apply with confidence on a platform built for trust, not noise.',
    primaryCta: { label: 'Check Eligibility', href: '#offers' },
    secondaryCta: { label: 'View Partner Banks', href: '#partners' },
  },
  stats: {
    labels: {
      cards: 'Live Card Offers',
      banks: 'Partner Banks',
      users: 'Users Guided',
      accuracy: 'Offer Accuracy',
    },
    values: {
      users: '250K+',
      accuracy: '99.2%',
    },
  },
  offers: {
    title: 'Featured Credit Card Offers',
    subtitle: 'Minimal, transparent comparisons for annual fee, issuer, and key value.',
    fallbackDescription: 'Premium card benefits with transparent terms and fee details.',
    feeLabel: 'Annual Fee:',
    unknownFee: 'As per issuer terms',
    primaryCta: 'Apply',
    secondaryCta: 'View details',
    emptyState: 'No active offers yet. Add cards from admin to publish offers here.',
  },
  partners: {
    title: 'Trusted Bank Partners',
    subtitle: 'Issuer relationships built for compliance, clarity, and long-term trust.',
    fallbackNames: ['HDFC', 'SBI', 'Axis', 'ICICI', 'Kotak', 'IDFC'],
  },
  benefits: {
    title: 'Why High-Intent Users Prefer This',
    subtitle: 'Designed to feel like premium software with bank-grade seriousness.',
    items: [
      {
        title: 'Transparent Comparison',
        description: 'All major fee and value details are visible before you apply.',
      },
      {
        title: 'Eligibility Clarity',
        description: 'Understand likely fit before hitting issuer application forms.',
      },
      {
        title: 'Trust-led Curation',
        description: 'Only serious, active card offers are presented to users.',
      },
      {
        title: 'Offer Monitoring',
        description: 'Updated listings for changing fee and benefits structures.',
      },
      {
        title: 'Secure Experience',
        description: 'No noisy distractions, only high-contrast financial information.',
      },
      {
        title: 'Education First',
        description: 'Learn terms and implications before making card decisions.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Clear answers for trust-sensitive financial decisions.',
    items: [
      {
        question: 'Does checking eligibility affect my credit score?',
        answer:
          'No. Eligibility checks shown here are informational and do not reduce your bureau score.',
      },
      {
        question: 'How often are offers updated?',
        answer:
          'Cards and offer details are refreshed regularly, but final terms are always issuer controlled.',
      },
      {
        question: 'Can I compare multiple cards at once?',
        answer:
          'Yes. Compare fee, issuer, and key offer value directly before choosing your next step.',
      },
      {
        question: 'Are these card approvals guaranteed?',
        answer: 'No. Final approval depends on each bank’s risk and policy checks.',
      },
    ],
  },
  blog: {
    title: 'Financial Education',
    subtitle: 'Knowledge-first content for better borrowing and rewards decisions.',
    badge: 'Insights',
    posts: [
      {
        title: 'How to evaluate annual fee vs value',
        excerpt: 'A practical approach for high-spend and low-spend profiles.',
      },
      {
        title: 'Rewards, miles, or cashback: what fits best?',
        excerpt: 'Use-case driven breakdown for selecting your card strategy.',
      },
      {
        title: 'Before you apply: 7 financial checks',
        excerpt: 'Reduce surprises by verifying eligibility and repayment readiness.',
      },
    ],
  },
  appDownload: {
    title: 'Get the CreditCardMarket App',
    description:
      'Track your shortlisted offers and apply from mobile with the same trust-led experience.',
    cta: { label: 'Download App', href: '#' },
  },
  footer: {
    brand: 'CreditCardMarket',
    description:
      'A trust-first financial marketplace for comparing credit card offers with transparency and clarity.',
    disclaimer:
      'Disclaimer: Card approval, credit limits, and final terms are solely determined by issuing banks.',
    columns: [
      {
        title: 'Cards',
        links: [
          { label: 'All Offers', href: '#offers' },
          { label: 'Rewards Cards', href: '#offers' },
          { label: 'Cashback Cards', href: '#offers' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'FAQs', href: '#faq' },
          { label: 'Education', href: '#blog' },
          { label: 'Admin', href: '/admin.html' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms', href: '#' },
          { label: 'Privacy', href: '#' },
          { label: 'Compliance', href: '#' },
        ],
      },
    ],
    copyright: '© 2026 CreditCardMarket. All rights reserved.',
    complianceLine: 'RBI-aligned disclosure norms • High-trust financial communication standards',
  },
} as const;
