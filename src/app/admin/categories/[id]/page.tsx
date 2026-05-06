'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import api from '@/services/api';
import { AdminCategory } from '../../admin-types';
import { useAdminSession } from '../../useAdminSession';
import CategoryForm from '../CategoryForm';

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params?.id ?? '';
  const { ready } = useAdminSession();
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready || !categoryId) {
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/categories/${categoryId}`);
        setCategory(response.data ?? null);
      } catch (error) {
        console.error('Failed to load category', error);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    void loadCategory();
  }, [ready, categoryId]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setSaving(true);
      await api.put(`/categories/${categoryId}`, Object.fromEntries(formData.entries()));
      router.push('/admin/categories');
    } catch {
      window.alert('Could not update the category');
    } finally {
      setSaving(false);
    }
  };

  if (!ready || loading) {
    return <div className="admin-page-surface">Loading category...</div>;
  }

  if (!category) {
    return (
      <div className="admin-page-surface">
        <p>Category not found.</p>
        <Link href="/admin/categories" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to categories</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page-stack">
      <div className="admin-page-head">
        <Link href="/admin/categories" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to categories</span>
        </Link>
        <div>
          <p className="admin-kicker">Edit category</p>
          <h2>{category.name}</h2>
        </div>
      </div>

      <CategoryForm
        initialCategory={category}
        submitLabel="Update category"
        onSubmit={handleSubmit}
        saving={saving}
      />

      <style jsx>{`
        .admin-page-stack {
          display: grid;
          gap: 1rem;
        }

        .admin-page-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-page-head h2 {
          margin: 0.25rem 0 0;
          font-size: 1.8rem;
          letter-spacing: -0.04em;
        }

        .admin-kicker {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #38bdf8;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .admin-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.75rem 0.95rem;
          border-radius: 9999px;
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(255, 255, 255, 0.03);
          width: fit-content;
        }

        .admin-page-surface {
          padding: 1.25rem;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(10, 14, 20, 0.9);
          border-radius: 1.35rem;
        }
      `}</style>
    </div>
  );
}