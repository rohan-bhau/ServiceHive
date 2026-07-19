export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  avatarUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  providerId: string | User;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  price: number;
  priceUnit: 'per_hour' | 'fixed';
  location: string;
  city: string;
  images: string[];
  tags: string[];
  availability: string;
  status: 'active' | 'paused';
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  serviceId: string;
  userId: string | User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string | Service;
  customerId: string | User;
  providerId: string | User;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
