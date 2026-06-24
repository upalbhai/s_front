'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AppChrome({ children, categories = [] }: { children: React.ReactNode, categories?: any[] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header categories={categories} />
      <main className="min-h-[80vh]">{children}</main>
      <Footer categories={categories} />
    </>
  );
}