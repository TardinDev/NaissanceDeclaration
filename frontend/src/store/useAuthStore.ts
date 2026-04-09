import { create } from 'zustand';
import type { AuthResponse, Role } from '@/types';
import { MOCK_MODE } from '@/mock/data';

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

function mockLogin(set: (state: Partial<AuthState>) => void, email: string) {
  const auth = {
    token: 'mock-jwt-token',
    email,
    firstName: email.split('@')[0],
    lastName: 'Utilisateur',
    role: 'CITIZEN' as Role,
  };
  localStorage.setItem('token', auth.token);
  localStorage.setItem('user', JSON.stringify(auth));
  set({ ...auth, isAuthenticated: true, isLoading: false });
}

function mockRegister(set: (state: Partial<AuthState>) => void, firstName: string, lastName: string, email: string) {
  const auth = {
    token: 'mock-jwt-token',
    email,
    firstName,
    lastName,
    role: 'CITIZEN' as Role,
  };
  localStorage.setItem('token', auth.token);
  localStorage.setItem('user', JSON.stringify(auth));
  set({ ...auth, isAuthenticated: true, isLoading: false });
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

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      mockLogin(set, email);
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.post('/auth/login', { email, password: _password });
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
    if (MOCK_MODE) {
      mockRegister(set, firstName, lastName, email);
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.post('/auth/register', {
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
