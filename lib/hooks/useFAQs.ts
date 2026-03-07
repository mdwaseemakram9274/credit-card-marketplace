import { useState, useCallback } from 'react';

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

export type UseFAQsReturn = {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  fetchFAQs: (category?: string, limit?: number) => Promise<void>;
  fetchFAQ: (id: string) => Promise<FAQ | null>;
  updateFAQ: (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>>, token: string) => Promise<FAQ | null>;
  createFAQ: (data: Omit<FAQ, 'id' | 'helpful_count' | 'unhelpful_count' | 'created_at' | 'updated_at' | 'published_at' | 'created_by'>, token: string) => Promise<FAQ | null>;
  deleteFAQ: (id: string, token: string) => Promise<boolean>;
};

export const useFAQs = (): UseFAQsReturn => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = useCallback(async (category?: string, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/faqs?limit=' + limit;
      if (category) {
        url += '&category=' + encodeURIComponent(category);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      if (data.success) {
        setFAQs(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.error || 'Failed to fetch FAQs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFAQ = useCallback(async (id: string): Promise<FAQ | null> => {
    try {
      const response = await fetch(`/api/faqs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch FAQ with ID "${id}"`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || `Failed to fetch FAQ with ID "${id}"`);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    }
  }, []);

  const updateFAQ = useCallback(
    async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>>, token: string): Promise<FAQ | null> => {
      setError(null);
      try {
        const response = await fetch(`/api/faqs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update FAQ');
        }

        const data = await response.json();
        if (data.success) {
          setFAQs((prev) =>
            prev.map((f) => (f.id === data.data.id ? data.data : f))
          );
          return data.data;
        } else {
          setError(data.error || 'Failed to update FAQ');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      }
    },
    []
  );

  const createFAQ = useCallback(
    async (faqData: Omit<FAQ, 'id' | 'helpful_count' | 'unhelpful_count' | 'created_at' | 'updated_at' | 'published_at' | 'created_by'>, token: string): Promise<FAQ | null> => {
      setError(null);
      try {
        const response = await fetch('/api/faqs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(faqData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create FAQ');
        }

        const data = await response.json();
        if (data.success) {
          setFAQs((prev) => [...prev, data.data]);
          return data.data;
        } else {
          setError(data.error || 'Failed to create FAQ');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      }
    },
    []
  );

  const deleteFAQ = useCallback(
    async (id: string, token: string): Promise<boolean> => {
      setError(null);
      try {
        const response = await fetch(`/api/faqs/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete FAQ');
        }

        const data = await response.json();
        if (data.success) {
          setFAQs((prev) => prev.filter((f) => f.id !== id));
          return true;
        } else {
          setError(data.error || 'Failed to delete FAQ');
          return false;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return false;
      }
    },
    []
  );

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
    fetchFAQ,
    updateFAQ,
    createFAQ,
    deleteFAQ,
  };
};
