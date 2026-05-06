'use client';

import { useState } from 'react';
import type { AdminCategory } from '../admin-types';

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  seoText: string;
  canonicalUrl: string;
  priority: string;
  isIndexable: boolean;
}

export const categoryDefaultValues: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
  seoText: '',
  canonicalUrl: '',
  priority: '0.8',
  isIndexable: true,
};

function createInitialValues(initialCategory?: AdminCategory | null): CategoryFormValues {
  if (!initialCategory) {
    return categoryDefaultValues;
  }

  return {
    name: initialCategory.name ?? '',
    slug: initialCategory.slug ?? '',
    description: initialCategory.description ?? '',
    seoTitle: initialCategory.seoTitle ?? '',
    seoDescription: initialCategory.seoDescription ?? '',
    ogImage: initialCategory.ogImage ?? '',
    seoText: initialCategory.seoText ?? '',
    canonicalUrl: initialCategory.canonicalUrl ?? '',
    priority: String(initialCategory.priority ?? 0.8),
    isIndexable: initialCategory.isIndexable !== false,
  };
}

interface CategoryFormProps {
  initialCategory?: AdminCategory | null;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

export default function CategoryForm({ initialCategory, submitLabel, onSubmit, onCancel, saving }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(() => createInitialValues(initialCategory));

  const updateField = (field: keyof CategoryFormValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', values.name.trim());
    formData.append('slug', values.slug.trim());
    formData.append('description', values.description.trim());
    formData.append('seoTitle', values.seoTitle.trim());
    formData.append('seoDescription', values.seoDescription.trim());
    formData.append('ogImage', values.ogImage.trim());
    formData.append('seoText', values.seoText.trim());
    formData.append('canonicalUrl', values.canonicalUrl.trim());
    formData.append('priority', values.priority.trim());
    formData.append('isIndexable', values.isIndexable ? 'true' : 'false');

    await onSubmit(formData);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <section className="form-panel">
          <h3>Core details</h3>
          <label>
            <span>Name</span>
            <input value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Category name" required />
          </label>
          <label>
            <span>Slug</span>
            <input value={values.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="category-slug" />
          </label>
          <label>
            <span>Description</span>
            <textarea value={values.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Short description" rows={4} />
          </label>
        </section>

        <section className="form-panel">
          <h3>SEO</h3>
          <label>
            <span>Meta title</span>
            <input value={values.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} placeholder="SEO title" />
          </label>
          <label>
            <span>Meta description</span>
            <textarea value={values.seoDescription} onChange={(event) => updateField('seoDescription', event.target.value)} placeholder="SEO description" rows={4} />
          </label>
          <label>
            <span>OG image</span>
            <input value={values.ogImage} onChange={(event) => updateField('ogImage', event.target.value)} placeholder="https://..." />
          </label>
          <label>
            <span>SEO text</span>
            <textarea value={values.seoText} onChange={(event) => updateField('seoText', event.target.value)} placeholder="Footer SEO content" rows={5} />
          </label>
        </section>

        <section className="form-panel">
          <h3>Publishing</h3>
          <label>
            <span>Canonical URL</span>
            <input value={values.canonicalUrl} onChange={(event) => updateField('canonicalUrl', event.target.value)} placeholder="/category/path" />
          </label>
          <label>
            <span>Priority</span>
            <input value={values.priority} onChange={(event) => updateField('priority', event.target.value)} placeholder="0.8" />
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={values.isIndexable} onChange={(event) => updateField('isIndexable', event.target.checked)} />
            <span>Indexable</span>
          </label>
        </section>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="secondary-action" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="submit" className="primary-action" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>

      <style jsx>{`
        .category-form {
          display: grid;
          gap: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .form-panel {
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(10, 14, 20, 0.9);
          border-radius: 1.25rem;
          padding: 1rem;
          display: grid;
          gap: 0.85rem;
        }

        .form-panel h3 {
          margin: 0;
          letter-spacing: -0.03em;
        }

        .form-panel label {
          display: grid;
          gap: 0.35rem;
        }

        .form-panel span {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .form-panel input,
        .form-panel textarea {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: #f8fafc;
          padding: 0.8rem 0.9rem;
          outline: none;
        }

        .form-panel textarea {
          resize: vertical;
        }

        .checkbox-row {
          display: flex !important;
          align-items: center;
          gap: 0.65rem;
        }

        .checkbox-row span {
          color: #e2e8f0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .primary-action,
        .secondary-action {
          border-radius: 9999px;
          padding: 0.85rem 1.1rem;
          font-weight: 700;
        }

        .primary-action {
          background: linear-gradient(135deg, #38bdf8, #0f172a);
          color: #f8fafc;
        }

        .secondary-action {
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.02);
        }

        @media (max-width: 1100px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}