import { useState, useCallback } from 'react';

export type HomepageSection = {
  id: string;
  section_key: string;
  section_name: string;
  section_type: string;
  content: Record<string, any>;
  description?: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

export type UseHomepageSectionsReturn = {
  sections: HomepageSection[];
  loading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;
  fetchSection: (key: string) => Promise<HomepageSection | null>;
  updateSection: (key: string, content: Record<string, any>, token: string) => Promise<HomepageSection | null>;
  createSection: (data: Omit<HomepageSection, 'id' | 'version' | 'created_at' | 'updated_at' | 'created_by'>, token: string) => Promise<HomepageSection | null>;
  deleteSection: (id: string, token: string) => Promise<boolean>;
};

export const useHomepageSections = (): UseHomepageSectionsReturn => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/homepage/sections');
      if (!response.ok) {
        throw new Error('Failed to fetch homepage sections');
      }
      const data = await response.json();
      if (data.success) {
        setSections(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.error || 'Failed to fetch sections');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSection = useCallback(async (key: string): Promise<HomepageSection | null> => {
    try {
      const response = await fetch(`/api/homepage/sections/${key}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch section "${key}"`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || `Failed to fetch section "${key}"`);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    }
  }, []);

  const updateSection = useCallback(
    async (key: string, content: Record<string, any>, token: string): Promise<HomepageSection | null> => {
      setError(null);
      try {
        const response = await fetch(`/api/homepage/sections/${key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update section');
        }

        const data = await response.json();
        if (data.success) {
          setSections((prev) =>
            prev.map((s) => (s.id === data.data.id ? data.data : s))
          );
          return data.data;
        } else {
          setError(data.error || 'Failed to update section');
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

  const createSection = useCallback(
    async (sectionData: Omit<HomepageSection, 'id' | 'version' | 'created_at' | 'updated_at' | 'created_by'>, token: string): Promise<HomepageSection | null> => {
      setError(null);
      try {
        const response = await fetch('/api/homepage/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sectionData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create section');
        }

        const data = await response.json();
        if (data.success) {
          setSections((prev) => [...prev, data.data]);
          return data.data;
        } else {
          setError(data.error || 'Failed to create section');
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

  const deleteSection = useCallback(
    async (id: string, token: string): Promise<boolean> => {
      setError(null);
      try {
        const response = await fetch(`/api/homepage/sections/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete section');
        }

        const data = await response.json();
        if (data.success) {
          setSections((prev) => prev.filter((s) => s.id !== id));
          return true;
        } else {
          setError(data.error || 'Failed to delete section');
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
    sections,
    loading,
    error,
    fetchSections,
    fetchSection,
    updateSection,
    createSection,
    deleteSection,
  };
};
