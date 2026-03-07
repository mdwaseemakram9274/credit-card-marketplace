-- Migration: Add Search Indexes for Credit Cards
-- Purpose: Enable efficient full-text and faceted search on cards
-- Created: $(date)

-- ============================================================================
-- 1. COMPOSITE INDEXES FOR FACETED SEARCH
-- ============================================================================

-- Index for browsing by status and recency
CREATE INDEX idx_cards_status_created ON cards(status, created_at DESC);

-- Index for filtering by network and status
CREATE INDEX idx_cards_network_status ON cards(network_id, status)
  WHERE status = 'enabled';

-- Index for filtering by card type and status with recency
CREATE INDEX idx_cards_cardtype_status_created ON cards(card_type_id, status, created_at DESC)
  WHERE status = 'enabled';

-- Index for browsing by bank and status
CREATE INDEX idx_cards_bank_status_created ON cards(bank_id, status, created_at DESC)
  WHERE status = 'enabled';

-- ============================================================================
-- 2. FULL-TEXT SEARCH INDEX
-- ============================================================================

-- Create a GIN (Generalized Inverted Index) index for full-text search
-- This enables fast substring and phrase matching in card names and descriptions
CREATE INDEX idx_cards_fulltext_search ON cards USING GIN(
  to_tsvector('english', 
    coalesce(card_name, '') || ' ' || 
    coalesce(product_description, '') || ' ' ||
    coalesce(reward_program_name, '')
  )
)
WHERE status = 'enabled';

-- ============================================================================
-- 3. JSONB INDEXES FOR COMPLEX FILTERING
-- ============================================================================

-- Index on rewards_details for efficient reward-specific queries
CREATE INDEX idx_cards_rewards_details ON cards USING GIN(rewards_details)
WHERE status = 'enabled';

-- Index on custom_fees for fee filtering
CREATE INDEX idx_cards_custom_fees ON cards USING GIN(custom_fees)
WHERE status = 'enabled';

-- Index on eligibility_criteria for eligibility filtering
CREATE INDEX idx_cards_eligibility ON cards USING GIN(eligibility_criteria)
WHERE status = 'enabled';

-- ============================================================================
-- 4. TEXT ARRAY INDEXES FOR CATEGORY/BENEFIT SEARCH
-- ============================================================================

-- Index on benefits array for benefit-based filtering
CREATE INDEX idx_cards_benefits ON cards USING GIN(benefits)
WHERE status = 'enabled';

-- Index on categories array for category-based filtering
CREATE INDEX idx_cards_categories ON cards USING GIN(categories)
WHERE status = 'enabled';

-- Index on product_features for feature filtering
CREATE INDEX idx_cards_features ON cards USING GIN(product_features)
WHERE status = 'enabled';

-- ============================================================================
-- 5. COMPOSITE INDEXES FOR COMMON SEARCH PATTERNS
-- ============================================================================

-- For browsing: network + bank + recent
CREATE INDEX idx_cards_network_bank_created ON cards(network_id, bank_id, created_at DESC)
WHERE status = 'enabled';

-- For filtering: annual_fee + status (useful for "free card" filtering)
CREATE INDEX idx_cards_annnual_fee_status ON cards(annual_fee, status)
WHERE status = 'enabled' AND annual_fee IS NOT NULL;

-- ============================================================================
-- 6. SEARCH ANALYTICS TABLE (Optional - for future analytics)
-- ============================================================================

-- Table to track search queries and results (for improving search relevance)
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  result_count INTEGER,
  user_session_id TEXT,
  selected_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on search queries for analytics
CREATE INDEX idx_search_queries_created ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_query ON search_queries(query);

-- ============================================================================
-- 7. MIGRATE CATEGORIES TO NORMALIZED SCHEMA (Optional Future Enhancement)
-- ============================================================================

-- This section is commented out but kept for reference
-- In the future, consider creating a normalized card_categories table:
/*
CREATE TABLE card_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE card_to_categories (
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  category_id UUID REFERENCES card_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, category_id)
);

CREATE INDEX idx_card_categories_card ON card_to_categories(card_id);
CREATE INDEX idx_card_categories_category ON card_to_categories(category_id);
*/

-- ============================================================================
-- 8. GRANT PERMISSIONS
-- ============================================================================

-- Allow public to read search analytics (if enabling search tracking)
-- GRANT SELECT ON search_queries TO anon;

-- Allow authenticated users to insert search queries
-- GRANT INSERT ON search_queries TO authenticated;

-- ============================================================================
-- SUMMARY OF CREATED INDEXES
-- ============================================================================
/*
Faceted Search Indexes (5):
- idx_cards_status_created: Status + recency browsing
- idx_cards_network_status: Card network filtering
- idx_cards_cardtype_status_created: Card type + status browsing
- idx_cards_bank_status_created: Bank browsing with status
- idx_cards_network_bank_created: Multi-dimension browsing

Full-Text Search (1):
- idx_cards_fulltext_search: Card name, description, rewards program search

JSONB Search (3):
- idx_cards_rewards_details: Reward capabilities filtering
- idx_cards_custom_fees: Custom fee filtering
- idx_cards_eligibility: Eligibility criteria filtering

Array Search (3):
- idx_cards_benefits: Benefit-based filtering
- idx_cards_categories: Category-based filtering
- idx_cards_features: Feature-based filtering

Special Filters (1):
- idx_cards_annnual_fee_status: Annual fee filtering

Total: 13 indexes for comprehensive search support
Plus: Search analytics table for future improvements
*/
