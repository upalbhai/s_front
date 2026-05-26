'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAdminUser, isAdminUser } from './admin-types';

const ADMIN_SESSION_EVENT = 'userInfoChanged';
let cachedAdminSessionSnapshot: string | null = null;

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener('storage', handleChange);
  window.addEventListener(ADMIN_SESSION_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(ADMIN_SESSION_EVENT, handleChange);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined') {
    return null;
  }

  const snapshot = window.localStorage.getItem('userInfo');
  if (snapshot === cachedAdminSessionSnapshot) {
    return cachedAdminSessionSnapshot;
  }

  cachedAdminSessionSnapshot = snapshot;
  return snapshot;
}

function getServerSnapshot() {
  return null;
}

export function useAdminSession() {
  const router = useRouter();
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = snapshot ? getStoredAdminUser() : null;
  const ready = snapshot !== null;

  useEffect(() => {
    const storedUser = getStoredAdminUser();

    if (!isAdminUser(storedUser)) {
      router.replace('/admin/login');
    }
  }, [router]);

  return { user: isAdminUser(user) ? user : null, ready };
}
