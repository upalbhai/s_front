'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { ChevronLeft } from 'lucide-react';
import { AdminCategory, AdminSound } from '../../admin-types';
import { useAdminSession } from '../../useAdminSession';
import SoundForm from '../SoundForm';
import { toast } from 'react-hot-toast';

export default function AdminEditSoundPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const soundId = params?.id ?? '';
  const { ready } = useAdminSession();
  const [sound, setSound] = useState<AdminSound | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready || !soundId) {
      return;
    }

    const loadRecord = async () => {
      try {
        setLoading(true);
        const [soundResponse, categoriesResponse] = await Promise.all([
          api.get(`/sounds/${soundId}`),
          api.get('/categories?limit=1000&admin=true'),
        ]);

        setSound(soundResponse.data ?? null);
        setCategories(Array.isArray(categoriesResponse.data.categories) ? categoriesResponse.data.categories : []);
      } catch (error) {
        console.error('Failed to load sound', error);
        setSound(null);
      } finally {
        setLoading(false);
      }
    };

    void loadRecord();
  }, [ready, soundId]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setSaving(true);
      await api.put(`/sounds/${soundId}`, formData);
      toast.success('Sound updated successfully');
      router.push('/admin/sounds');
    } catch {
      toast.error('Could not update the sound');
    } finally {
      setSaving(false);
    }
  };

  if (!ready || loading) {
    return <div className="admin-page-surface">Loading sound...</div>;
  }

  if (!sound) {
    return (
      <div className="admin-page-surface">
        <p>Sound not found.</p>
        <Link href="/admin/sounds" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to sounds</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page-stack">
      <div className="admin-page-head">
        <Link href="/admin/sounds" className="admin-back-link">
          <ChevronLeft size={16} />
          <span>Back to sounds</span>
        </Link>
        <div>
          <p className="admin-kicker">Edit sound</p>
          <h2>{sound.title}</h2>
        </div>
      </div>

      <SoundForm
        categories={categories}
        initialSound={sound}
        submitLabel="Update sound"
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
