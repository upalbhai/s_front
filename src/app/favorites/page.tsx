'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) {
          router.push('/login');
          return;
        }
        const { data } = await api.get('/users/profile');
        setFavorites(data.favorites);
      } catch (error: any) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [router]);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet. Start explore and add some!</p>
      ) : (
        <div className="grid">
          {favorites.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
}
