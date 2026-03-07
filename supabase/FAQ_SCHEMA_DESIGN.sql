-- FAQ Management Schema Design
-- Purpose: Store and manage FAQs for public display and admin editing
-- Last Updated: 7 March 2026

--============================================================================
-- FAQ DATA STRUCTURE
--============================================================================

-- Table: faqs
-- Description: Stores FAQ items with admin controls for publishing/drafting
-- Use Cases:
--   1. Display FAQs on homepage "What to Know" section
--   2. Auto-populate FAQ schema for SEO (structured data)
--   3. Admin can edit/create FAQs without code changes
--   4. Support filtering by category (General, Eligibility, Application, etc.)

/* Schema Design:
  
  CREATE TABLE faqs (
    id UUID PRIMARY KEY,                    -- Unique identifier
    question TEXT NOT NULL,                 -- FAQ question (e.g., "What is annual fee?")
    answer TEXT NOT NULL,                   -- FAQ answer (rich HTML or plain text)
    category VARCHAR(100),                  -- FAQ category (General, Eligibility, Application, etc.)
    display_order INTEGER DEFAULT 999,      -- Sort order (lower = first)
    is_active BOOLEAN DEFAULT TRUE,         -- Visibility control
    tags TEXT[],                            -- Search tags for filtering
    
    -- Metadata
    is_featured BOOLEAN DEFAULT FALSE,      -- Pin important FAQs to top
    helpful_count INTEGER DEFAULT 0,        -- Track helpful votes
    unhelpful_count INTEGER DEFAULT 0,      -- Track unhelpful votes
    
    -- Audit Trail
    created_by UUID REFERENCES admins(id),  -- Who created this FAQ
    updated_by UUID REFERENCES admins(id),  -- Who last updated
    created_at TIMESTAMP DEFAULT NOW(),     -- Creation timestamp
    updated_at TIMESTAMP DEFAULT NOW(),     -- Last update timestamp
    published_at TIMESTAMP,                 -- When published (for drafts)
    
    CONSTRAINT valid_category CHECK (
      category IN (
        'General', 'Eligibility', 'Application', 
        'Benefits', 'Fees', 'Usage', 'Rewards', 
        'Security', 'Support', 'Other'
      )
    )
  );

  -- Indexes for performance
  CREATE INDEX idx_faqs_active ON faqs(is_active);
  CREATE INDEX idx_faqs_category ON faqs(category, is_active);
  CREATE INDEX idx_faqs_featured ON faqs(is_featured, display_order);
  CREATE INDEX idx_faqs_updated ON faqs(updated_at DESC);

  -- RLS (Row Level Security)
  - Public: Can READ all active FAQs
  - Admin: Can READ/UPDATE/DELETE all FAQs (draft & published)
  
  -- Triggers
  - auto-update updated_at on any UPDATE
  - increment helpful_count on vote
  - increment unhelpful_count on vote
*/

--============================================================================
-- FAQ CATEGORIES & USE CASES
--============================================================================
/*
  Supported Categories:
  
  1. 'General'
     - What is a credit card?
     - Why should I get a credit card?
     - How do credit cards work?
  
  2. 'Eligibility'
     - Who can apply for a credit card?
     - What's the minimum income required?
     - What credit score do I need?
  
  3. 'Application'
     - How do I apply?
     - How long does approval take?
     - What documents do I need?
  
  4. 'Benefits'
     - What are cashback benefits?
     - What's lounge access?
     - How do rewards work?
  
  5. 'Fees'
     - What's the annual fee?
     - When do I pay joining fee?
     - Are there late payment charges?
  
  6. 'Usage'
     - How do I activate my card?
     - Can I use abroad?
     - What's the credit limit?
  
  7. 'Rewards'
     - How do I earn rewards?
     - How do I redeem points?
     - Can points expire?
  
  8. 'Security'
     - Is my card secure?
     - What if card is lost?
     - How is fraud prevented?
  
  9. 'Support'
     - How do I contact support?
     - What's the customer service number?
     - How do I report fraud?
  
  10. 'Other'
      - Miscellaneous FAQs
*/

--============================================================================
-- SAMPLE FAQ DATA
--============================================================================
/*
Sample FAQs to seed:

{
  "question": "What is a credit card?",
  "answer": "A credit card is a payment card issued by banks...",
  "category": "General",
  "display_order": 1,
  "is_active": true,
  "is_featured": true,
  "tags": ["basics", "credit-card", "general"]
},
{
  "question": "Who can apply for a credit card?",
  "answer": "To apply for a credit card, you must be...",
  "category": "Eligibility",
  "display_order": 1,
  "is_active": true,
  "tags": ["eligibility", "requirements", "age"]
},
{
  "question": "How do I apply for a credit card?",
  "answer": "Here are the steps to apply: 1. Compare cards...",
  "category": "Application",
  "display_order": 1,
  "is_active": true,
  "tags": ["application", "process", "steps"]
},
{
  "question": "What's the difference between cashback and rewards?",
  "answer": "Cashback is direct money back...",
  "category": "Rewards",
  "display_order": 1,
  "is_active": true,
  "tags": ["rewards", "cashback", "benefits"]
},
{
  "question": "What is an annual fee?",
  "answer": "An annual fee is a charge levied by banks...",
  "category": "Fees",
  "display_order": 1,
  "is_active": true,
  "tags": ["fees", "annual", "cost"]
}
*/

--============================================================================
-- API ENDPOINTS PLANNED
--============================================================================
/*
Endpoint: /api/faqs
  - GET /api/faqs
    • Fetch all active FAQs (public)
    • Query params: ?category=General&limit=10&offset=0
  
  - POST /api/faqs
    • Create new FAQ (admin only)
    • Body: { question, answer, category, is_featured, tags }
  
Endpoint: /api/faqs/[id]
  - GET /api/faqs/[id]
    • Fetch single FAQ by ID (public if active)
  
  - PUT /api/faqs/[id]
    • Update FAQ (admin only)
    • Body: { question, answer, category, is_active, is_featured }
  
  - DELETE /api/faqs/[id]
    • Soft delete FAQ (admin only)
    • Sets is_active = false
  
Endpoint: /api/faqs/[id]/vote
  - POST /api/faqs/[id]/vote
    • Record helpful/unhelpful vote (public, rate-limited)
    • Body: { vote_type: "helpful" | "unhelpful" }
*/

--============================================================================
-- ADMIN UI PLANNED
--============================================================================
/*
Features:
  1. FAQ List View
     - Show all FAQs (active + inactive)
     - Search by question/answer
     - Filter by category
     - Sort by: newest, featured, popular (helpful votes)
  
  2. FAQ Editor
     - Create new FAQ
     - Edit existing FAQ
     - WYSIWYG editor for answer text
     - Category dropdown
     - Toggle: active/inactive, featured/normal
     - Preview rendered FAQ
  
  3. FAQ Manager Tab in AdminPage
     - Similar layout to HomepageSectionsManager
     - Bulk actions: publish, unpublish, delete
*/
