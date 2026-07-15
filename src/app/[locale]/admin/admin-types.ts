export interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
  token?: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  isIndexable?: boolean;
}

export interface AdminSound {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  category?: AdminCategory | string | null;
  fileUrl?: string;
  howToUse?: string;
  downloadInfo?: string;
  transcript?: string;
  tags?: string[];
  isPublished?: boolean;
  playCount?: number;
  downloadCount?: number;
  siteIds?: string[];
}

export interface AdminBlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  featuredImage?: string;
  author?: string;
  isPublished?: boolean;
  views?: number;
  publishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = window.localStorage.getItem('userInfo');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AdminUser;
  } catch {
    return null;
  }
}

export function isAdminUser(user: AdminUser | null): boolean {
  return Boolean(user && user.role === 'admin');
}

export function getSoundCategoryId(sound: AdminSound | null | undefined): string {
  if (!sound?.category) {
    return '';
  }

  return typeof sound.category === 'string' ? sound.category : sound.category._id;
}

export function getSoundCategoryName(sound: AdminSound | null | undefined): string {
  if (!sound?.category) {
    return 'Unassigned';
  }

  return typeof sound.category === 'string' ? sound.category : sound.category.name;
}
