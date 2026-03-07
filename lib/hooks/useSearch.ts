import { useState, useCallback, useEffect } from 'react';
import type { SearchFilters, SearchResponse, SearchResult } from '../../../pages/api/cards/search';

interface UseSearch {
  results: SearchResult[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  search: (newFilters?: Partial<SearchFilters>) => Promise<void>;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  q: undefined,
  network: undefined,
  bank: undefined,
  cardType: undefined,
  categories: undefined,
  benefits: undefined,
  features: undefined,
  sortBy: 'relevance',
  limit: 20,
  offset: 0,
  status: 'enabled',
};

/**
 * useSearch Hook
 * Manages card search state and performs API calls with advanced filtering
 */
export function useSearch(): UseSearch {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  /**
   * Perform search with current filters
   */
  const search = useCallback(
    async (newFilters?: Partial<SearchFilters>) => {
      try {
        setLoading(true);
        setError(null);

        // Merge new filters with existing ones
        const mergedFilters = {
          ...filters,
          ...newFilters,
          offset: newFilters?.offset ?? 0, // Reset to first page if filters change
        };

        // Build query string
        const params = new URLSearchParams();
        if (mergedFilters.q) params.append('q', mergedFilters.q);
        if (mergedFilters.network) params.append('network', mergedFilters.network);
        if (mergedFilters.bank) params.append('bank', mergedFilters.bank);
        if (mergedFilters.cardType) params.append('cardType', mergedFilters.cardType);
        if (mergedFilters.categories && mergedFilters.categories.length > 0) {
          mergedFilters.categories.forEach((cat) => params.append('categories', cat));
        }
        if (mergedFilters.benefits && mergedFilters.benefits.length > 0) {
          mergedFilters.benefits.forEach((ben) => params.append('benefits', ben));
        }
        if (mergedFilters.features && mergedFilters.features.length > 0) {
          mergedFilters.features.forEach((feat) => params.append('features', feat));
        }
        if (mergedFilters.minAnnualFee !== undefined)
          params.append('minAnnualFee', String(mergedFilters.minAnnualFee));
        if (mergedFilters.maxAnnualFee !== undefined)
          params.append('maxAnnualFee', String(mergedFilters.maxAnnualFee));
        if (mergedFilters.hasWelcomeBonus) params.append('hasWelcomeBonus', 'true');
        if (mergedFilters.hasCashback) params.append('hasCashback', 'true');
        if (mergedFilters.hasLounge) params.append('hasLounge', 'true');
        params.append('sortBy', mergedFilters.sortBy || 'relevance');
        params.append('limit', String(mergedFilters.limit || 20));
        params.append('offset', String(mergedFilters.offset || 0));
        params.append('status', mergedFilters.status || 'enabled');

        // Fetch from search API
        const response = await fetch(`/api/cards/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data: SearchResponse = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Search failed');
        }

        setResults(data.data);
        setTotal(data.total);
        setFilters(mergedFilters);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to search cards');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  /**
   * Update filters and trigger search
   */
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const merged = { ...filters, ...newFilters, offset: 0 };
      setFilters(merged);
    },
    [filters]
  );

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setResults([]);
    setTotal(0);
  }, []);

  // Auto-trigger search when filters change
  useEffect(() => {
    if (filters.q || filters.network || filters.bank || filters.cardType) {
      search();
    }
  }, [filters, search]);

  return {
    results,
    total,
    loading,
    error,
    filters,
    updateFilters,
    search,
    resetFilters,
  };
}

/**
 * Fetch filter options (networks, banks, types, categories, benefits)
 */
export async function fetchFilterOptions() {
  try {
    // Fetch all cards to extract unique filter values
    const response = await fetch('/api/cards?limit=1000&status=enabled');
    if (!response.ok) throw new Error('Failed to fetch filter options');

    const data = await response.json();
    const cards = data.data || [];

    const networks = Array.from(
      new Set(cards.map((c: SearchResult) => c.network).filter(Boolean))
    ) as string[];
    const banks = Array.from(
      new Set(cards.map((c: SearchResult) => c.banks?.name).filter(Boolean))
    ) as string[];
    const categories = Array.from(
      new Set(cards.flatMap((c: SearchResult) => c.categories || []))
    ) as string[];
    const benefits = Array.from(
      new Set(cards.flatMap((c: SearchResult) => c.benefits || []))
    ) as string[];
    const features = Array.from(
      new Set(cards.flatMap((c: SearchResult) => c.product_description || ''))
    ) as string[];

    return {
      networks: networks.sort(),
      banks: banks.sort(),
      categories: categories.sort(),
      benefits: benefits.sort(),
      features: features.sort(),
    };
  } catch (err) {
    console.error('Failed to fetch filter options:', err);
    return {
      networks: [],
      banks: [],
      categories: [],
      benefits: [],
      features: [],
    };
  }
}
