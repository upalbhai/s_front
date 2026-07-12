'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { ChevronLeft } from 'lucide-react';
import { AdminCategory } from '../../admin-types';
import { useAdminSession } from '../../useAdminSession';
import SoundForm from '../SoundForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AdminNewSoundPage() {
  const router = useRouter();
  const { ready } = useAdminSession();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const loadCategories = async () => {
      try {
        const response = await api.get('/categories?limit=1000&admin=true');
        setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    void loadCategories();
  }, [ready]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setSaving(true);
      await api.post('/sounds', formData);
      toast.success('Sound created successfully');
      router.push('/admin/sounds');
    } catch {
      toast.error('Could not create the sound');
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return <div className="admin-page-surface">Loading editor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <div className="admin-page-head">
        <Link href="/admin/sounds" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to sounds</span>
        </Link>
        <div>
          <p className="admin-kicker">Create sound</p>
          <h2>New route-based entry</h2>
        </div>
      </div>

      <SoundForm categories={categories} submitLabel="Save sound" onSubmit={handleSubmit} saving={saving} />

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
