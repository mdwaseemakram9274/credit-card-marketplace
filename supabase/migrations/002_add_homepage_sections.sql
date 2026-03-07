-- Migration: Add homepage_sections table for dynamic content management
-- Created: 2026-03-07
-- Purpose: Enable admin control over homepage sections

-- Create the homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1,
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  CONSTRAINT valid_section_type CHECK (section_type IN ('text', 'list', 'table', 'grid', 'hero', 'mixed'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_homepage_sections_key ON homepage_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON homepage_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_updated ON homepage_sections(updated_at DESC);

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for homepage_sections
DROP TRIGGER IF EXISTS update_homepage_sections_updated_at ON homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at
BEFORE UPDATE ON homepage_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default/seed homepage sections
INSERT INTO homepage_sections (section_key, section_name, section_type, content, description, is_active) VALUES
(
  'hero_banner',
  'Hero Banner',
  'hero',
  '{
    "title": "Best Credit Cards in India 2026",
    "subtitle": "Compare, Apply & Get Instant Approval",
    "cta_text": "Find Your Card",
    "cta_link": "/cards",
    "background_image": ""
  }'::jsonb,
  'Main hero section at top of page',
  TRUE
),
(
  'best_cards',
  'Best Credit Cards in India',
  'grid',
  '{
    "title": "Best Credit Cards in India",
    "description": "Explore top-rated cards from leading banks",
    "limit": 10
  }'::jsonb,
  'Grid of featured/best cards',
  TRUE
),
(
  'new_to_credit',
  'Cards for New to Credit',
  'grid',
  '{
    "title": "Cards for New to Credit",
    "description": "Start your credit journey with these cards",
    "limit": 6
  }'::jsonb,
  'Cards for first-time credit users',
  TRUE
),
(
  'steps_to_apply',
  'Steps to Apply for a Credit Card',
  'list',
  '{
    "title": "Steps to Apply for a Credit Card",
    "items": [
      {
        "step": 1,
        "title": "Check Eligibility",
        "description": "Meet age (21+), income, and credit score requirements"
      },
      {
        "step": 2,
        "title": "Choose Your Card",
        "description": "Select a card that matches your spending habits"
      },
      {
        "step": 3,
        "title": "Apply Online",
        "description": "Fill out the application form with your details"
      },
      {
        "step": 4,
        "title": "Verification",
        "description": "Bank verifies your information"
      },
      {
        "step": 5,
        "title": "Get Approved",
        "description": "Receive approval and collect your card"
      }
    ]
  }'::jsonb,
  'Steps involved in applying for a credit card',
  TRUE
),
(
  'benefits_list',
  '5 Benefits of Using a Credit Card',
  'list',
  '{
    "title": "5 Benefits of Using a Credit Card",
    "items": [
      {
        "icon": "🎁",
        "title": "Rewards & Cashback",
        "description": "Earn reward points or cashback on every transaction"
      },
      {
        "icon": "✈️",
        "title": "Travel Benefits",
        "description": "Get airport lounge access and travel insurance"
      },
      {
        "icon": "🛡️",
        "title": "Fraud Protection",
        "description": "Enhanced security and fraud protection for your money"
      },
      {
        "icon": "📊",
        "title": "Build Credit History",
        "description": "Improve your credit score with responsible usage"
      },
      {
        "icon": "💳",
        "title": "Flexible Payments",
        "description": "EMI options and interest-free periods on purchases"
      }
    ]
  }'::jsonb,
  'Main benefits of having a credit card',
  TRUE
),
(
  'things_to_know',
  'Things to Know Before Applying',
  'list',
  '{
    "title": "Things to Know Before Applying",
    "items": [
      "Check your eligibility criteria before applying",
      "Compare different cards for better benefits",
      "Understand the fee structure and charges",
      "Ensure you can meet minimum income requirements",
      "Check your credit score before applying",
      "Read terms and conditions carefully"
    ]
  }'::jsonb,
  'Important things to know before applying',
  TRUE
),
(
  'dos_and_donts',
  'Do''s and Don''ts for Credit Cards',
  'mixed',
  '{
    "title": "Do''s and Don''ts for Credit Card Usage",
    "dos": [
      "Pay your full bill before the due date",
      "Monitor your credit score regularly",
      "Track your spending and set a budget",
      "Use rewards and cashback benefits wisely",
      "Keep your PIN and OTP secure"
    ],
    "donts": [
      "Don''t overspend beyond your repayment capacity",
      "Don''t miss payments or make late payments",
      "Don''t share your card details with anyone",
      "Don''t apply for too many cards in a short time",
      "Don''t carry a high credit card balance"
    ]
  }'::jsonb,
  'Do''s and Don''ts for credit card usage',
  TRUE
),
(
  'credit_vs_debit',
  'Credit Card vs. Debit Card',
  'table',
  '{
    "title": "Credit Card vs. Debit Card",
    "columns": ["Feature", "Credit Card", "Debit Card"],
    "rows": [
      ["What You Spend", "Bank''s money", "Your money"],
      ["Credit Line", "Yes", "No"],
      ["Building Credit", "Yes", "No"],
      ["Rewards", "Yes", "Limited"],
      ["Fraud Protection", "Strong", "Limited"],
      ["Interest Charges", "Yes (if unpaid)", "No"],
      ["Best For", "Large purchases", "Daily expenses"]
    ]
  }'::jsonb,
  'Comparison between credit and debit cards',
  TRUE
),
(
  'types_of_cards',
  'Types of Credit Cards in India',
  'list',
  '{
    "title": "Types of Credit Cards in India",
    "description": "Different types available to suit your needs",
    "items": [
      {
        "title": "Cashback Cards",
        "description": "Direct cash refund on purchases"
      },
      {
        "title": "Travel Cards",
        "description": "Rewards focused on travel and dining"
      },
      {
        "title": "Rewards Cards",
        "description": "Earn points on all transactions"
      },
      {
        "title": "Premium Cards",
        "description": "High-end benefits and exclusive perks"
      },
      {
        "title": "Student Cards",
        "description": "Designed for students with lower income requirement"
      }
    ]
  }'::jsonb,
  'Different types of credit cards available',
  TRUE
),
(
  'fees_and_charges',
  'Credit Card Fees and Charges',
  'text',
  '{
    "title": "Credit Card Fees and Charges",
    "content": "Credit cards come with various charges including annual fees, joining fees, and transaction charges. Common charges include: Joining Fee (one-time), Annual Fees (yearly), Interest/Finance Charges (if balance carried), Cash Withdrawal Fees, Overlimit Charges, and Late Payment Fees."
  }'::jsonb,
  'Overview of fees and charges',
  TRUE
),
(
  'interest_rate',
  'Credit Card Interest Rate',
  'text',
  '{
    "title": "Credit Card Interest Rate (APR)",
    "content": "Credit card interest rates typically range from 24% to 45% annually. The exact rate depends on your creditworthiness, the bank''s policies, and your credit limit. If you pay your full balance by the due date, no interest is charged."
  }'::jsonb,
  'Information about interest rates',
  TRUE
),
(
  'how_to_choose',
  'How to Choose the Right Credit Card',
  'list',
  '{
    "title": "How to Choose the Right Credit Card?",
    "items": [
      {
        "title": "Analyze Your Spending",
        "description": "Understand where you spend the most - dining, travel, shopping, etc."
      },
      {
        "title": "Compare Rewards Programs",
        "description": "Look for cards offering rewards in your spending categories"
      },
      {
        "title": "Check Annual Fees",
        "description": "Compare annual fees and ensure benefits justify the cost"
      },
      {
        "title": "Review Eligibility",
        "description": "Meet the income and credit score requirements"
      },
      {
        "title": "Look for Additional Benefits",
        "description": "Insurance, airport lounge, cashback, or other perks"
      }
    ]
  }'::jsonb,
  'Guide to choosing the right card',
  TRUE
),
(
  'eligibility',
  'Eligibility Criteria and Documents',
  'list',
  '{
    "title": "Eligibility Criteria and Documents Required",
    "eligibility": {
      "age": "At least 21 years old",
      "income": "Minimum monthly income (varies by bank)",
      "credit_score": "Typically 600+ (optional for first-time users)"
    },
    "documents": [
      "Valid ID proof (Aadhaar, Passport, PAN)",
      "Address proof (Utility bill, Rental agreement)",
      "Income proof (Salary slips, IT returns)",
      "Employment letter (if required)"
    ]
  }'::jsonb,
  'Eligibility criteria and required documents',
  TRUE
),
(
  'credit_score_info',
  'How a Credit Card Can Help Improve Your Credit Score',
  'text',
  '{
    "title": "How a Credit Card Can Help Improve Your Credit Score",
    "content": "Using a credit card responsibly can significantly improve your credit score. Timely payments, low credit utilization, and diverse credit mix positively impact your score. A good credit score (750+) helps you get faster approvals for loans and credit products."
  }'::jsonb,
  'Info on improving credit score',
  TRUE
),
(
  'smart_tips',
  '5 Smart Tips to Manage Your Credit Card',
  'list',
  '{
    "title": "5 Smart Tips to Manage Your Credit Card Effectively",
    "items": [
      {
        "icon": "📅",
        "title": "Set Payment Reminders",
        "description": "Never miss a payment by setting calendar reminders or auto-pay"
      },
      {
        "icon": "💰",
        "title": "Keep Credit Utilization Low",
        "description": "Use less than 30% of your credit limit to maintain a good credit score"
      },
      {
        "icon": "📊",
        "title": "Monitor Your Statement",
        "description": "Regularly check your statements for unauthorized transactions"
      },
      {
        "icon": "🔄",
        "title": "Use Rewards Wisely",
        "description": "Maximize rewards but avoid overspending to earn points"
      },
      {
        "icon": "🔒",
        "title": "Keep Your Card Secure",
        "description": "Never share CVV or PIN and use secure passwords for online banking"
      }
    ]
  }'::jsonb,
  'Smart tips for managing credit cards',
  TRUE
),
(
  'global_faqs',
  'Frequently Asked Questions',
  'list',
  '{
    "title": "Frequently Asked Questions About Credit Cards",
    "items": [
      {
        "question": "What is a credit card?",
        "answer": "A credit card is a financial tool that allows you to borrow money from a bank up to a certain credit limit and pay it back later."
      },
      {
        "question": "How do I apply for a credit card?",
        "answer": "You can apply online through the bank''s website, visit a branch, or through a partner website. Provide required documents and wait for approval."
      },
      {
        "question": "What is a credit score?",
        "answer": "A credit score (300-900) is a number that represents your creditworthiness. Higher scores increase approval chances for loans."
      },
      {
        "question": "Is there an interest-free period?",
        "answer": "Yes, most credit cards offer 20-50 days interest-free period if you pay your full bill by the due date."
      },
      {
        "question": "What happens if I make a late payment?",
        "answer": "Late payments result in late fees, interest charges, and negatively impact your credit score."
      }
    ]
  }'::jsonb,
  'Global FAQs on credit cards',
  TRUE
)
ON CONFLICT (section_key) DO NOTHING;

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see and manage all sections
CREATE POLICY admin_access_homepage_sections ON homepage_sections
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = TRUE))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = TRUE));

-- Policy: Public can only see active sections (via API)
CREATE POLICY public_read_active_sections ON homepage_sections
  FOR SELECT
  USING (is_active = TRUE);

-- Grant permissions
GRANT SELECT ON homepage_sections TO anon, authenticated;
GRANT ALL ON homepage_sections TO authenticated;
