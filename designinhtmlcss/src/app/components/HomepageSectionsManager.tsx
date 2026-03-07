import React, { useState, useEffect } from 'react';
import styles from './HomepageSectionsManager.module.css';
import { useHomepageSections, type HomepageSection } from '../../../lib/hooks/useHomepageSections';

type Props = {
  adminToken: string;
};

export const HomepageSectionsManager: React.FC<Props> = ({ adminToken }) => {
  const { sections, loading, error, fetchSections, updateSection, deleteSection } = useHomepageSections();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    if (selectedKey && sections.length > 0) {
      const section = sections.find((s) => s.section_key === selectedKey);
      if (section) {
        setEditingContent(JSON.stringify(section.content, null, 2));
        setIsActive(section.is_active);
      }
    }
  }, [selectedKey, sections]);

  const handleSave = async () => {
    if (!selectedKey) return;

    setIsSaving(true);
    try {
      const content = JSON.parse(editingContent);
      const result = await updateSection(selectedKey, content, adminToken);
      if (result) {
        alert('Section updated successfully!');
      } else {
        alert('Failed to update section');
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey) return;

    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    const section = sections.find((s) => s.section_key === selectedKey);
    if (!section) return;

    setIsSaving(true);
    try {
      const result = await deleteSection(section.id, adminToken);
      if (result) {
        alert('Section deleted successfully!');
        setSelectedKey(null);
      } else {
        alert('Failed to delete section');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading homepage sections...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Homepage Sections Manager</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.layout}>
        {/* Section List */}
        <div className={styles.sectionList}>
          <h3>Sections ({sections.length})</h3>
          <div className={styles.listContent}>
            {sections.map((section) => (
              <button
                key={section.section_key}
                className={`${styles.sectionItem} ${selectedKey === section.section_key ? styles.active : ''}`}
                onClick={() => setSelectedKey(section.section_key)}
              >
                <div className={styles.sectionItemName}>{section.section_name}</div>
                <div className={styles.sectionItemMeta}>
                  <span className={styles.type}>{section.section_type}</span>
                  <span className={`${styles.status} ${section.is_active ? styles.active : styles.inactive}`}>
                    {section.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className={styles.editor}>
          {selectedKey ? (
            <>
              <div className={styles.editorHeader}>
                <div>
                  <h3>{sections.find((s) => s.section_key === selectedKey)?.section_name}</h3>
                  <p className={styles.key}>Key: {selectedKey}</p>
                </div>
                <div className={styles.controls}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      disabled={isSaving}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className={styles.editorContent}>
                <label>Content (JSON)</label>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  disabled={isSaving}
                  placeholder="Enter valid JSON"
                  rows={15}
                />
              </div>

              <div className={styles.editorFooter}>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  Delete Section
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a section to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
