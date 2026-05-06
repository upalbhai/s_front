'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import api from '@/services/api';
import CategoryForm from '../CategoryForm';
import { useAdminSession } from '../../useAdminSession';

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const { ready } = useAdminSession();

  const handleSubmit = async (formData: FormData) => {
    try {
      await api.post('/categories', Object.fromEntries(formData.entries()));
      router.push('/admin/categories');
    } catch {
      window.alert('Could not create the category');
    }
  };

  if (!ready) {
    return <div className="admin-page-surface">Loading category editor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <div className="admin-page-head">
        <Link href="/admin/categories" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to categories</span>
        </Link>
        <div>
          <p className="admin-kicker">Create category</p>
          <h2>New route-based category</h2>
        </div>
      </div>

      <CategoryForm submitLabel="Create category" onSubmit={handleSubmit} />

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