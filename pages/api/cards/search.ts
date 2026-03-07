import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Type definitions
export interface SearchFilters {
  q?: string; // Full-text search query
  network?: string; // Card network (Visa, Mastercard, etc.)
  bank?: string; // Bank ID or slug
  cardType?: string; // Card type ID
  categories?: string[]; // Card categories
  benefits?: string[]; // Specific benefits to filter
  features?: string[]; // Product features to filter
  minAnnualFee?: number; // Minimum annnual fee (or "free" for 0)
  maxAnnualFee?: number; // Maximum annual fee
  hasWelcomeBonus?: boolean; // Filter by welcome bonus
  hasCashback?: boolean; // Filter by cashback
  hasLounge?: boolean; // Filter by lounge access
  sortBy?: 'relevance' | 'newest' | 'name' | 'fee_asc' | 'fee_desc'; // Sort order
  limit?: number; // Results per page (default 20, max 100)
  offset?: number; // Pagination offset
  status?: 'enabled' | 'disabled' | 'draft'; // Card status filter
}

export interface SearchResult {
  id: string;
  card_name: string;
  card_image_url?: string;
  bank_id: string;
  network?: string;
  annual_fee?: string;
  welcome_bonus?: string;
  benefits?: string[];
  categories?: string[];
  product_description?: string;
  rewards_details?: Record<string, any>;
  banks?: { id: string; name: string; slug: string } | { id: any; name: any; slug: any } | any[];
  card_networks?: { id: string; name: string } | { id: any; name: any } | any[];
}

export interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  total: number;
  limit: number;
  offset: number;
  filters: SearchFilters;
  error?: string;
}

// Parse filter strings from URL query parameters
function parseFilters(query: NextApiRequest['query']): SearchFilters {
  const limit = Math.min(parseInt(query.limit as string) || 20, 100); // Max 100 per page
  const offset = Math.max(parseInt(query.offset as string) || 0, 0);
  const sortBy = (query.sortBy as any) || 'relevance';

  // Parse array filters
  const categories = query.categories
    ? Array.isArray(query.categories)
      ? query.categories
      : [query.categories]
    : undefined;

  const benefits = query.benefits
    ? Array.isArray(query.benefits)
      ? query.benefits
      : [query.benefits]
    : undefined;

  const features = query.features
    ? Array.isArray(query.features)
      ? query.features
      : [query.features]
    : undefined;

  return {
    q: (query.q as string) || undefined,
    network: (query.network as string) || undefined,
    bank: (query.bank as string) || undefined,
    cardType: (query.cardType as string) || undefined,
    categories,
    benefits,
    features,
    minAnnualFee: query.minAnnualFee ? parseInt(query.minAnnualFee as string) : undefined,
    maxAnnualFee: query.maxAnnualFee ? parseInt(query.maxAnnualFee as string) : undefined,
    hasWelcomeBonus: query.hasWelcomeBonus === 'true' ? true : undefined,
    hasCashback: query.hasCashback === 'true' ? true : undefined,
    hasLounge: query.hasLounge === 'true' ? true : undefined,
    sortBy: sortBy as any,
    status: (query.status as any) || 'enabled',
    limit,
    offset,
  };
}

// Build the Supabase query dynamically based on filters
async function buildSearchQuery(filters: SearchFilters) {
  let query = supabase
    .from('cards')
    .select(
      `
      id,
      card_name,
      card_image_url,
      bank_id,
      network,
      annual_fee,
      welcome_bonus,
      benefits,
      categories,
      product_description,
      rewards_details,
      banks(id, name, slug),
      card_networks(id, name)
    `,
      { count: 'exact' }
    )
    .eq('status', filters.status);

  // Apply full-text search query
  if (filters.q && filters.q.trim().length > 0) {
    const searchTerm = filters.q.trim();
    // Use full-text search if available, otherwise use ilike
    query = query.or(
      `card_name.ilike.%${searchTerm}%,product_description.ilike.%${searchTerm}%,reward_program_name.ilike.%${searchTerm}%`
    );
  }

  // Apply network filter
  if (filters.network) {
    query = query.eq('network', filters.network);
  }

  // Apply bank filter
  if (filters.bank) {
    // Try to match by slug or id
    query = query.or(`bank_id.eq.${filters.bank},banks.slug.eq.${filters.bank}`);
  }

  // Apply card type filter
  if (filters.cardType) {
    query = query.eq('card_type_id', filters.cardType);
  }

  // Apply category filter (any of the categories match)
  if (filters.categories && filters.categories.length > 0) {
    // For each category, match if it's in the array
    const categoryFilters = filters.categories.map((cat) => `categories.cs.{"${cat}"}`).join(',');
    query = query.or(categoryFilters);
  }

  // Apply benefits filter (any of the benefits match)
  if (filters.benefits && filters.benefits.length > 0) {
    const benefitFilters = filters.benefits.map((ben) => `benefits.cs.{"${ben}"}`).join(',');
    query = query.or(benefitFilters);
  }

  // Apply features filter (any of the features match)
  if (filters.features && filters.features.length > 0) {
    const featureFilters = filters.features
      .map((feat) => `product_features.cs.{"${feat}"}`)
      .join(',');
    query = query.or(featureFilters);
  }

  // Apply annual fee filter
  if (filters.minAnnualFee !== undefined || filters.maxAnnualFee !== undefined) {
    // Note: This is complex because annual_fee is TEXT. We'd need casting or a separate table.
    // For now, simple string comparison (useful for "Free" vs "₹0" distinction)
    if (filters.minAnnualFee === 0) {
      query = query.in('annual_fee', ['Free', '0', '₹0', 'Free Annual Fee']);
    }
  }

  // Apply welcome bonus filter
  if (filters.hasWelcomeBonus) {
    query = query.not('welcome_bonus', 'is', null).neq('welcome_bonus', '');
  }

  // Apply cashback filter (checks rewards_details)
  if (filters.hasCashback) {
    query = query.not('rewards_details->cashbackRate', 'is', null);
  }

  // Apply lounge access filter (checks rewards_details)
  if (filters.hasLounge) {
    query = query.or(
      `rewards_details->domesticLoungeAccess.not.is.null,rewards_details->internationalLoungeAccess.not.is.null`
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'name':
      query = query.order('card_name', { ascending: true });
      break;
    case 'fee_asc':
      // Would need to cast TEXT to numeric, for now sort by text
      query = query.order('annual_fee', { ascending: true });
      break;
    case 'fee_desc':
      query = query.order('annual_fee', { ascending: false });
      break;
    case 'relevance':
    default:
      // Relevance: newer cards + featured first if we had a featured flag
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;
  query = query.range(offset, offset + limit - 1);

  return query;
}

// Main API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      data: [],
      total: 0,
      limit: 0,
      offset: 0,
      filters: {},
      error: `Method ${req.method} not allowed`,
    });
  }

  try {
    // Parse filters from query parameters
    const filters = parseFilters(req.query);

    // Build and execute the query
    const query = await buildSearchQuery(filters);
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase search error:', error);
      return res.status(500).json({
        success: false,
        data: [],
        total: 0,
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        filters,
        error: `Database error: ${error.message}`,
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      data: data || [],
      total: count || 0,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      filters,
    });
  } catch (err: any) {
    console.error('Search API error:', err);
    return res.status(500).json({
      success: false,
      data: [],
      total: 0,
      limit: 20,
      offset: 0,
      filters: {},
      error: `Server error: ${err.message}`,
    });
  }
}
