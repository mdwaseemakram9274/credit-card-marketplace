-- Migration: Add FAQs table for managing frequently asked questions
-- Created: 7 March 2026
-- Purpose: Enable admin control over FAQs with category and visibility controls

-- Create the faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_category CHECK (
    category IN (
      'General', 'Eligibility', 'Application', 
      'Benefits', 'Fees', 'Usage', 'Rewards', 
      'Security', 'Support', 'Other'
    )
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category, is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_featured ON faqs(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_updated ON faqs(updated_at DESC);

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for faqs
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default/seed FAQ categories
INSERT INTO faqs (question, answer, category, display_order, is_active, is_featured, tags) VALUES

-- General FAQs
(
  'What is a credit card?',
  'A credit card is a payment card issued by a bank that allows you to borrow money to make purchases. You receive a bill for the amount borrowed and can choose to pay it back over time (with interest) or in full.',
  'General',
  1,
  TRUE,
  TRUE,
  ARRAY['basics', 'credit-card', 'general']
),
(
  'Why should I get a credit card?',
  'Credit cards offer several benefits: Build credit history, Earn rewards on purchases, Emergency backup payment method, Interest-free period on purchases, Access to credit card insurance and protections.',
  'General',
  2,
  TRUE,
  FALSE,
  ARRAY['benefits', 'reasons', 'general']
),
(
  'How do credit cards work?',
  'When you use a credit card to make a purchase, the card issuer pays the merchant on your behalf. You then receive a monthly statement showing all your transactions. You can pay the full balance or a minimum amount by the due date.',
  'General',
  3,
  TRUE,
  FALSE,
  ARRAY['how-it-works', 'process', 'general']
),

-- Eligibility FAQs
(
  'Who can apply for a credit card?',
  'To apply for a credit card in India, you typically need to be: At least 21 years old, Have a regular income (salaried or self-employed), Have a valid identification and address proof, Have a decent credit score (usually 740+).',
  'Eligibility',
  1,
  TRUE,
  TRUE,
  ARRAY['eligibility', 'requirements', 'age']
),
(
  'What credit score do I need?',
  'Most banks require a credit score of 750 or above for credit card approval. However, some banks may approve applicants with scores as low as 700, while premium cards may require 800+. Your credit score is calculated based on payment history, credit utilization, and length of credit history.',
  'Eligibility',
  2,
  TRUE,
  FALSE,
  ARRAY['credit-score', 'eligibility', 'requirements']
),

-- Application FAQs
(
  'How do I apply for a credit card?',
  'Step 1: Compare credit cards and choose one that suits your needs. Step 2: Click "Apply Now" on the card. Step 3: Fill in your personal and financial information. Step 4: Upload required documents (ID proof, address proof, income proof). Step 5: Submit and wait for approval (usually 3-5 business days).',
  'Application',
  1,
  TRUE,
  TRUE,
  ARRAY['application', 'process', 'steps', 'apply']
),
(
  'What documents do I need to apply?',
  'You typically need: Valid ID proof (Aadhar, PAN, Passport, Driving License), Address proof (utility bill, rental agreement, bank statement), Income proof (salary slip, bank statement, ITR for self-employed), Pan card is mandatory for most applications.',
  'Application',
  2,
  TRUE,
  FALSE,
  ARRAY['documents', 'requirements', 'application']
),
(
  'How long does credit card approval take?',
  'Most credit card applications are approved or rejected within 3-5 business days. Some banks offer instant approval for existing customers. The physical card is usually delivered within 7-10 business days after approval.',
  'Application',
  3,
  TRUE,
  FALSE,
  ARRAY['approval', 'timeline', 'how-long']
),

-- Benefits FAQs
(
  'What is cashback?',
  'Cashback is a percentage of your purchase amount that is returned to you as cash or credit in your account. For example, if you have a card with 1% cashback and spend ₹10,000, you get ₹100 back. Cashback can usually be redeemed as bill credits, transferable points, or cash.',
  'Benefits',
  1,
  TRUE,
  TRUE,
  ARRAY['cashback', 'benefits', 'rewards']
),
(
  'What is lounge access?',
  'Lounge access allows you to use airport (and sometimes railway) lounges for free. You get complimentary access to lounges where you can relax, eat, drink, and use amenities like shower rooms and WiFi before your flight. Usually included in premium credit cards.',
  'Benefits',
  2,
  TRUE,
  FALSE,
  ARRAY['lounge-access', 'benefits', 'premium']
),
(
  'Do rewards points expire?',
  'Rewards program rules vary by bank. Some cards offer lifetime validity for points, while others expire after 2-3 years of inactivity. Check your card''s terms and conditions for specific expiration policies. Generally, using your card regularly keeps your account active and points valid.',
  'Benefits',
  3,
  TRUE,
  FALSE,
  ARRAY['rewards', 'points', 'expiry']
),

-- Fees FAQs
(
  'What is an annual fee?',
  'An annual fee is a charge levied by the bank for providing the credit card. It''s typically charged on the card anniversary every year. Some cards waive the annual fee if you spend a minimum amount in the first year. Some premium cards may have annual fees of ₹500 to ₹50,000 or more.',
  'Fees',
  1,
  TRUE,
  TRUE,
  ARRAY['fees', 'annual', 'cost']
),
(
  'What is a joining fee?',
  'A joining fee is a one-time charge levied when you open a new credit card account. It may be combined with the first year''s annual fee or charged separately. Some banks waive the joining fee for the first year or for specific customer segments.',
  'Fees',
  2,
  TRUE,
  FALSE,
  ARRAY['fees', 'joining', 'opening']
),
(
  'What are late payment charges?',
  'If you fail to pay your credit card bill by the due date, the bank charges a late payment fee (usually ₹100-₹500 depending on the outstanding amount). Additional charges include finance charges on the unpaid amount. It''s important to pay at least the minimum amount by the due date to avoid these charges.',
  'Fees',
  3,
  TRUE,
  FALSE,
  ARRAY['late-payment', 'fees', 'penalties']
),

-- Usage FAQs
(
  'What is a credit limit?',
  'A credit limit is the maximum amount you can spend using your credit card at any given time. The bank sets this limit based on your income, credit score, and creditworthiness. You can request for a limit increase after 6 months of regular card usage.',
  'Usage',
  1,
  TRUE,
  TRUE,
  ARRAY['credit-limit', 'usage', 'how-much']
),
(
  'Can I use my credit card abroad?',
  'Yes, most credit cards can be used abroad for purchases and cash withdrawals. However, keep in mind that you may incur foreign exchange markup charges (typically 2-4%) and cash withdrawal fees. Inform your bank before traveling to avoid your card being blocked for security reasons.',
  'Usage',
  2,
  TRUE,
  FALSE,
  ARRAY['international', 'abroad', 'travel']
),

-- Security FAQs
(
  'Is my credit card information secure?',
  'Yes, credit cards are highly secure. Banks use encryption, fraud monitoring, and tokenization to protect your data. However, it''s important to never share your CVV/OTP, use ATMs in safe locations, and enable transaction alerts on your card.',
  'Security',
  1,
  TRUE,
  TRUE,
  ARRAY['security', 'safe', 'protection']
),
(
  'What should I do if my card is lost or stolen?',
  'Immediately contact your bank''s customer service and report the loss. The bank will block your card to prevent unauthorized usage. You can request a replacement card, usually delivered within 7-10 days. Monitor your account for any unauthorized transactions.',
  'Security',
  2,
  TRUE,
  FALSE,
  ARRAY['lost', 'stolen', 'card', 'security']
);

-- Enable RLS (Row Level Security)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read all active FAQs
CREATE POLICY faq_read_policy ON faqs
  FOR SELECT
  USING (is_active = TRUE);

-- RLS Policy: Admins can read all FAQs (active and inactive)
CREATE POLICY faq_admin_read_policy ON faqs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = TRUE
    )
  );

-- RLS Policy: Only admins can insert FAQs
CREATE POLICY faq_admin_insert_policy ON faqs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = TRUE
    )
  );

-- RLS Policy: Only admins can update FAQs
CREATE POLICY faq_admin_update_policy ON faqs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = TRUE
    )
  );

-- RLS Policy: Only admins can delete FAQs
CREATE POLICY faq_admin_delete_policy ON faqs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = TRUE
    )
  );
