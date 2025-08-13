export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'auditor';
  avatar?: string;
  language: 'es' | 'va' | 'en';
  createdAt: Date;
  lastActive?: Date;
  isActive: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  gallery: string[];
  publishDate: Date;
  status: 'draft' | 'scheduled' | 'published';
  author: string;
  tags: string[];
  featured: boolean;
  versions: NewsVersion[];
}

export interface NewsVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface POI {
  id: string;
  name: string;
  type: 'activity' | 'restaurant' | 'beach' | 'viewpoint' | 'shop' | 'park' | 'sports';
  category: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  occupancy: number;
  featuredImage: string;
  gallery: string[];
  features: string[];
  isActive: boolean;
}

export interface Activity extends POI {
  price: number;
  duration: number;
  maxCapacity: number;
  requiresReservation: boolean;
  reservationUrl?: string;
  schedule: ActivitySchedule[];
}

export interface ActivitySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  startDate: Date;
  endDate: Date;
  category: string;
  isPublic: boolean;
  status: 'draft' | 'published';
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  sendPush: boolean;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  internalLink?: string;
  targetUser?: string;
  status: 'scheduled' | 'sent';
  scheduledDate?: Date;
  sentDate?: Date;
}

export interface KPI {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface Settings {
  branding: {
    logo: string;
    title: string;
  };
  homeBlocks: {
    id: string;
    type: string;
    title: string;
    isActive: boolean;
    order: number;
  }[];
  translations: Record<string, Record<string, string>>;
  aiProvider: 'deepseek' | 'gemini';
}

export type Language = 'es' | 'va' | 'en';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles?: string[];
}