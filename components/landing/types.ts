export type MarketplaceCard = {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  annualFee?: string;
};

export type MarketplaceBank = {
  slug: string;
  name: string;
  description?: string;
  cards?: MarketplaceCard[];
};

export type MarketplaceResponse = {
  source?: 'cloud' | 'local';
  banks: MarketplaceBank[];
};

export type FeaturedCard = MarketplaceCard & {
  bankSlug: string;
  bankName: string;
};
