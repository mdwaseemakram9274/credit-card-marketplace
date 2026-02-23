import { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is the minimum credit score required to get a credit card?",
      answer: "Most banks require a credit score of 700 or above for regular credit cards. Premium cards typically require 750+. However, if you're applying for the first time or have no credit history, you can opt for secured credit cards or student credit cards which have more lenient requirements.",
      category: "Basics",
    },
    {
      question: "How long does it take to get a credit card approved?",
      answer: "The approval process typically takes 7-10 working days. Some banks offer instant approval for pre-approved customers. After approval, the physical card is delivered within 7-15 days. You can start using the card immediately by adding it to digital wallets even before the physical card arrives.",
      category: "Basics",
    },
    {
      question: "What is the difference between minimum amount due and total amount due?",
      answer: "The minimum amount due is typically 5% of your total outstanding balance (or ₹100-200, whichever is higher). Paying only this amount keeps your account active but you'll be charged high interest (24-48% annually) on the remaining balance. The total amount due is the full balance, which if paid, attracts no interest charges.",
      category: "Payments",
    },
    {
      question: "Can I have multiple credit cards from different banks?",
      answer: "Yes, you can have multiple credit cards from different banks. In fact, having multiple cards can improve your overall credit limit and reduce credit utilization ratio. However, ensure you can manage all cards responsibly and pay all bills on time. Too many applications in a short period can negatively impact your credit score.",
      category: "Usage",
    },
    {
      question: "What should I do if my credit card is lost or stolen?",
      answer: "Immediately call your bank's customer care and block the card. Report it through the mobile app or internet banking as well. File a police complaint if necessary. The bank will issue a replacement card. Most banks offer zero liability protection for unauthorized transactions if reported promptly.",
      category: "Security",
    },
    {
      question: "How can I increase my credit card limit?",
      answer: "You can request a credit limit increase through your bank's mobile app, internet banking, or customer service. Banks typically review your request based on your income, credit score, payment history, and card usage. Regular usage with timely payments for 6-12 months increases chances of approval. Some banks automatically offer limit increases.",
      category: "Usage",
    },
    {
      question: "Are there any charges for closing a credit card?",
      answer: "Most banks don't charge for closing a credit card, but you must clear all outstanding dues first. However, closing a card within the first year may attract closure charges. Before closing, consider the impact on your credit score - it reduces your available credit and can increase utilization ratio.",
      category: "Fees",
    },
    {
      question: "Can I convert my purchases into EMI?",
      answer: "Yes, most credit cards allow you to convert purchases above a certain amount (usually ₹2,500-5,000) into EMIs. You can do this through mobile app, internet banking, or by calling customer care. EMI tenure ranges from 3 to 24 months. An EMI processing fee (₹99-999) is usually charged.",
      category: "Usage",
    },
    {
      question: "What is the credit card interest-free period?",
      answer: "The interest-free period is typically 45-50 days from the date of purchase. This includes the billing cycle (usually 30 days) plus the payment due date (15-20 days after bill generation). You pay no interest if you pay the total amount due before the payment due date. This period doesn't apply to cash withdrawals.",
      category: "Fees",
    },
    {
      question: "How do credit card rewards and cashback work?",
      answer: "Rewards points are earned on every purchase (typically 1-4 points per ₹100-150 spent) and can be redeemed for vouchers, merchandise, or air miles. Cashback is direct money credited to your account (1-5% of purchase value). Different cards have different earning rates for categories like dining, fuel, shopping, etc.",
      category: "Rewards",
    },
    {
      question: "What is CVV and should I share it with anyone?",
      answer: "CVV (Card Verification Value) is the 3-digit security code on the back of your card. Never share your CVV, PIN, or OTP with anyone, including people claiming to be from the bank. Banks never ask for this information. This is crucial for preventing fraud and unauthorized transactions.",
      category: "Security",
    },
    {
      question: "Can I use my credit card internationally?",
      answer: "Yes, Visa and Mastercard credit cards are accepted internationally. However, you'll pay a forex markup fee (typically 3-3.5% of transaction value). Inform your bank before international travel to avoid card blocking. Some premium cards offer zero forex markup and travel benefits like insurance and lounge access.",
      category: "Usage",
    },
    {
      question: "What is credit utilization ratio and why does it matter?",
      answer: "Credit utilization ratio is the percentage of your credit limit that you're using. For example, if your limit is ₹1,00,000 and you've used ₹30,000, your utilization is 30%. Keeping it below 30% is ideal for a good credit score. High utilization suggests you're credit-dependent and can lower your score.",
      category: "Credit Score",
    },
    {
      question: "How are credit card annual fees waived?",
      answer: "Many cards waive annual fees if you meet minimum spending criteria (e.g., spend ₹1,50,000 annually). Some cards are lifetime free with no annual fees ever. Premium cards usually charge non-waivable fees but offer benefits worth more than the fee. You can also call customer care and request a waiver based on your usage.",
      category: "Fees",
    },
    {
      question: "What happens if I miss my credit card payment?",
      answer: "Missing a payment results in late payment fees (₹500-1,300), interest charges on the outstanding balance, and negative impact on your credit score. If you miss payments for 30+ days, it's reported to credit bureaus and can drop your score by 50-100 points. Contact your bank immediately if you anticipate difficulty in payment.",
      category: "Payments",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-gray-50">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-black leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about credit cards in India
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isLast = index === faqs.length - 1;
            
            return (
              <div
                key={index}
                className={`${!isLast ? 'border-b border-gray-200' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 md:py-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-medium text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 md:px-8 pb-5 md:pb-6">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-600 mb-4">
            Still have questions?
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </section>
  );
}