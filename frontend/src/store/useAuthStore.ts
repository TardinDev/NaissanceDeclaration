import { create } from 'zustand';
import api from '@/api/axios';
import type { ApiResponse, AuthResponse, Role } from '@/types';

interface AuthState {
  token: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
      const auth = data.data;
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth));
      set({
        token: auth.token,
        email: auth.email,
        firstName: auth.firstName,
        lastName: auth.lastName,
        role: auth.role as Role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Erreur de connexion',
      });
      throw err;
    }
  },

  register: async (firstName: string, lastName: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      const auth = data.data;
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth));
      set({
        token: auth.token,
        email: auth.email,
        firstName: auth.firstName,
        lastName: auth.lastName,
        role: auth.role as Role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        isLoading: false,
        error: error.response?.data?.message || "Erreur lors de l'inscription",
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      token: null,
      email: null,
      firstName: null,
      lastName: null,
      role: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthResponse;
        set({
          token,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as Role,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
}));
