import { create } from 'zustand';
import type { AuthResponse, Role } from '@/types';
import { MOCK_MODE, mockAddUser, mockFindUserByEmail } from '@/mock/data';

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
}

function mockLogin(set: (state: Partial<AuthState>) => void, email: string) {
  const account = mockFindUserByEmail(email);
  const auth = {
    token: 'mock-jwt-token',
    email,
    firstName: account?.firstName ?? email.split('@')[0],
    lastName: account?.lastName ?? 'Utilisateur',
    role: account?.role ?? ('CITIZEN' as Role),
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
  mockAddUser(firstName, lastName, email);
  localStorage.setItem('token', auth.token);
  localStorage.setItem('user', JSON.stringify(auth));
  set({ ...auth, isAuthenticated: true, isLoading: false });
}

// Lu de façon synchrone à la création du store : sinon un rechargement sur une
// route protégée redirige vers /login avant que la session ne soit restaurée.
function readStoredSession(): Pick<AuthState, 'token' | 'email' | 'firstName' | 'lastName' | 'role' | 'isAuthenticated'> {
  const empty = { token: null, email: null, firstName: null, lastName: null, role: null, isAuthenticated: false };
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return empty;
    const user = JSON.parse(userStr) as AuthResponse;
    return {
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isAuthenticated: true,
    };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return empty;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readStoredSession(),
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
}));
