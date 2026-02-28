import imgBobcardPremier from "figma:asset/d326441dbe055cea6b310850b0fa9e9e904edcd5.png";

export interface CreditCardData {
  id: string;
  image: string;
  title: string;
  joiningFee: string;
  renewalFee: string;
  benefits: string[];
  categories: string[];
  description?: string;
}

export const creditCardsData: CreditCardData[] = [
  {
    id: "bob-premier-bobcard",
    image: imgBobcardPremier,
    title: "Bank of Baroda Premier BOBCARD",
    joiningFee: "₹1200",
    renewalFee: "₹1200",
    benefits: [
      "5X Reward Points on online, dining, and travel spends",
      "1% Fuel Surcharge Waiver on fuel transactions between ₹400–₹5,000",
      "500 Bonus Reward Points on spending ₹5,000 within 60 days of card issuance",
      "Complimentary lounge access at domestic airports",
      "Personal accident insurance coverage up to ₹10 lakhs",
      "Zero fraud liability on lost/stolen cards",
    ],
    categories: ["Dining", "Shopping", "Travel"],
    description: "Experience premium banking with BOB Premier card, designed for lifestyle enthusiasts who value rewards and travel benefits.",
  },
  {
    id: "bob-premier-bobcard-2",
    image: imgBobcardPremier,
    title: "Bank of Baroda Premier BOBCARD",
    joiningFee: "₹1200",
    renewalFee: "₹1200",
    benefits: [
      "5X Reward Points on online, dining, and travel spends",
      "1% Fuel Surcharge Waiver on fuel transactions between ₹400–₹5,000",
      "500 Bonus Reward Points on spending ₹5,000 within 60 days of card issuance",
      "Complimentary lounge access at domestic airports",
      "Personal accident insurance coverage up to ₹10 lakhs",
    ],
    categories: ["Dining", "Shopping"],
    description: "Experience premium banking with BOB Premier card, designed for lifestyle enthusiasts who value rewards and travel benefits.",
  },
];
