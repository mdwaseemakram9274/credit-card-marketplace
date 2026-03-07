import React, { useState, useEffect } from 'react';
import styles from './FAQManager.module.css';
import { useFAQs, type FAQ } from '../../../../lib/hooks/useFAQs';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

type Props = {
  adminToken: string;
};

const CATEGORIES = [
  'General',
  'Eligibility',
  'Application',
  'Benefits',
  'Fees',
  'Usage',
  'Rewards',
  'Security',
  'Support',
  'Other',
];

export const FAQManager: React.FC<Props> = ({ adminToken }) => {
  const { faqs, loading, error, fetchFAQs, updateFAQ, createFAQ, deleteFAQ } = useFAQs();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'helpful_count' | 'unhelpful_count'> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  useEffect(() => {
    if (selectedId && faqs.length > 0) {
      const faq = faqs.find((f) => f.id === selectedId);
      if (faq) {
        setEditForm({
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          display_order: faq.display_order,
          is_active: faq.is_active,
          is_featured: faq.is_featured,
          tags: faq.tags,
        });
      }
    }
  }, [selectedId, faqs]);

  const filteredFAQs = filterCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === filterCategory);

  const handleSave = async () => {
    if (!editForm) return;

    setIsSaving(true);
    try {
      if (isCreating) {
        const result = await createFAQ(editForm, adminToken);
        if (result) {
          alert('FAQ created successfully!');
          setIsCreating(false);
          setEditForm(null);
        } else {
          alert('Failed to create FAQ');
        }
      } else if (selectedId) {
        const result = await updateFAQ(selectedId, editForm, adminToken);
        if (result) {
          alert('FAQ updated successfully!');
        } else {
          alert('Failed to update FAQ');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await deleteFAQ(selectedId, adminToken);
      if (result) {
        alert('FAQ deleted successfully!');
        setSelectedId(null);
        setEditForm(null);
      } else {
        alert('Failed to delete FAQ');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedId(null);
    setEditForm({
      question: '',
      answer: '',
      category: 'General',
      display_order: 999,
      is_active: true,
      is_featured: false,
      tags: [],
    });
  };

  if (loading) {
    return <div className={styles.container}>Loading FAQs...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>FAQ Manager</h2>
        <button
          className={styles.createBtn}
          onClick={handleCreateNew}
          disabled={isSaving}
        >
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.layout}>
        {/* FAQ List */}
        <div className={styles.listPanel}>
          <div className={styles.filterSection}>
            <label>Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option>All</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.listContent}>
            <h3>FAQs ({filteredFAQs.length})</h3>
            {filteredFAQs.map((faq) => (
              <button
                key={faq.id}
                className={`${styles.faqItem} ${selectedId === faq.id && !isCreating ? styles.active : ''}`}
                onClick={() => {
                  setIsCreating(false);
                  setSelectedId(faq.id);
                }}
              >
                <div className={styles.faqQuestion}>{faq.question}</div>
                <div className={styles.faqMeta}>
                  <span className={styles.category}>{faq.category}</span>
                  <span className={`${styles.status} ${faq.is_active ? styles.active : styles.inactive}`}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {faq.is_featured && <span className={styles.featured}>Featured</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className={styles.editor}>
          {editForm ? (
            <>
              <div className={styles.editorHeader}>
                <div>
                  <h3>{isCreating ? 'Create New FAQ' : 'Edit FAQ'}</h3>
                </div>
                {!isCreating && (
                  <button
                    className={styles.closeBtn}
                    onClick={() => {
                      setSelectedId(null);
                      setEditForm(null);
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className={styles.formContent}>
                <div className={styles.formGroup}>
                  <label>Question</label>
                  <input
                    type="text"
                    value={editForm.question}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    disabled={isSaving}
                    placeholder="Enter FAQ question"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Answer</label>
                  <textarea
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                    disabled={isSaving}
                    placeholder="Enter FAQ answer"
                    rows={8}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      disabled={isSaving}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={editForm.display_order}
                      onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      disabled={isSaving}
                    />
                    Active
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={editForm.is_featured}
                      onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                      disabled={isSaving}
                    />
                    Featured (Pin to top)
                  </label>
                </div>
              </div>

              <div className={styles.editorFooter}>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving || !editForm.question || !editForm.answer}
                >
                  {isSaving ? 'Saving...' : isCreating ? 'Create FAQ' : 'Update FAQ'}
                </button>
                {!isCreating && (
                  <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}
                {isCreating && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => {
                      setIsCreating(false);
                      setEditForm(null);
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select an FAQ to edit or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
