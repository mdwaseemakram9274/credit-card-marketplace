/**
 * FEATURE 2: Homepage API - Database Schema Design
 * 
 * Purpose: Store all editable homepage sections in the database
 * Allows admins to manage content without code changes
 * 
 * Table: homepage_sections
 * 
 * Sections to manage:
 * 1. hero_banner - Hero section with title, subtitle, CTA
 * 2. best_cards - "Best Credit Cards" grid settings
 * 3. new_to_credit - "Cards for New to Credit" settings
 * 4. steps_to_apply - Steps/stages to apply
 * 5. benefits_list - "5 Benefits of Using CC"
 * 6. things_to_know - "Things to Know Before Applying"
 * 7. dos_and_donts - Do's and Don'ts
 * 8. credit_vs_debit - Comparison table
 * 9. card_types - Types of credit cards
 * 10. fees_and_charges - Fees overview
 * 11. interest_rate - Interest rate explainer
 * 12. how_to_choose - "How to Choose" guide
 * 13. eligibility - Eligibility criteria
 * 14. credit_score - Credit score info
 * 15. smart_tips - "5 Smart Tips to Manage"
 * 16. footer_content - Footer links/info
 * 17. global_faqs - Homepage FAQs section
 */

-- Table Structure
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,                -- Unique identifier (e.g., 'hero_banner')
  section_name TEXT NOT NULL,                       -- Display name (e.g., 'Hero Banner')
  section_type TEXT NOT NULL,                       -- Type: 'text', 'list', 'table', 'grid'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,      -- Flexible content structure
  description TEXT,                                 -- Admin description of section
  is_active BOOLEAN DEFAULT TRUE,                  -- Show/hide on frontend
  version INT DEFAULT 1,                           -- Version tracking for rollback
  created_by UUID REFERENCES admins(id),           -- Admin who created
  updated_by UUID REFERENCES admins(id),           -- Admin who last updated
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,                          -- When last published to production
  CONSTRAINT valid_section_type CHECK (section_type IN ('text', 'list', 'table', 'grid', 'hero', 'mixed'))
);

-- Indexes
CREATE INDEX idx_homepage_sections_key ON homepage_sections(section_key);
CREATE INDEX idx_homepage_sections_active ON homepage_sections(is_active);
CREATE INDEX idx_homepage_sections_updated ON homepage_sections(updated_at DESC);

-- Audit trigger for updated_at
CREATE OR REPLACE TRIGGER update_homepage_sections_updated_at
BEFORE UPDATE ON homepage_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

/**
 * Content Structure Examples (stored in JSONB content field):
 */

-- 1. HERO BANNER (type: 'hero')
{
  "title": "Best Credit Cards in India 2026",
  "subtitle": "Compare, Apply & Get Instant Approval",
  "cta_text": "Find Your Card",
  "cta_link": "/cards",
  "background_url": "https://...",
  "image_url": "https://..."
}

-- 2. BEST CARDS (type: 'grid')
{
  "title": "Best Credit Cards in India",
  "description": "Explore top-rated cards from leading banks",
  "limit": 10,
  "filters": {
    "segment": "Premium",
    "status": "enabled"
  }
}

-- 3. STEPS TO APPLY (type: 'list')
{
  "title": "Steps to Apply for a Credit Card",
  "items": [
    {
      "step": 1,
      "title": "Check Eligibility",
      "description": "Meet income and credit score requirements"
    },
    {
      "step": 2,
      "title": "Apply Online",
      "description": "Fill out your details and submit"
    },
    {
      "step": 3,
      "title": "Get Approved",
      "description": "Receive approval within 24-48 hours"
    }
  ]
}

-- 4. BENEFITS LIST (type: 'list')
{
  "title": "5 Benefits of Using a Credit Card",
  "items": [
    {
      "icon": "🎁",
      "title": "Rewards & Cashback",
      "description": "Earn points on every transaction"
    },
    {
      "icon": "✈️",
      "title": "Travel Benefits",
      "description": "Lounge access and travel insurance"
    }
  ]
}

-- 5. DO'S & DON'TS (type: 'mixed')
{
  "title": "Do's and Don'ts for Credit Cards",
  "dos": [
    "Pay your bills on time",
    "Monitor your credit score"
  ],
  "donts": [
    "Don't overspend",
    "Don't miss payments"
  ]
}

-- 6. COMPARISON TABLE (type: 'table')
{
  "title": "Credit Card vs. Debit Card",
  "columns": ["Feature", "Credit Card", "Debit Card"],
  "rows": [
    ["Credit Line", "Yes", "No"],
    ["Rewards", "Yes", "Limited"],
    ["Safety", "Protected", "Limited protection"]
  ]
}

-- 7. FAQs (type: 'list')
{
  "title": "Frequently Asked Questions",
  "items": [
    {
      "question": "What is a credit card?",
      "answer": "A financial tool that allows you to borrow money...",
      "category": "basics"
    }
  ]
}
