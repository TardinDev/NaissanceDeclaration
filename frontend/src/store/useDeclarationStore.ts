import { create } from 'zustand';
import type { Declaration, DeclarationFormData, ReviewData } from '@/types';
import {
  MOCK_MODE,
  mockGetMyDeclarations,
  mockGetPendingDeclarations,
  mockGetAllDeclarations,
  mockGetDeclarationById,
  mockCreateDeclaration,
  mockSubmitDeclaration,
  mockReviewDeclaration,
} from '@/mock/data';

interface DeclarationState {
  declarations: Declaration[];
  currentDeclaration: Declaration | null;
  isLoading: boolean;
  error: string | null;

  fetchMyDeclarations: () => Promise<void>;
  fetchPendingDeclarations: () => Promise<void>;
  fetchAllDeclarations: () => Promise<void>;
  fetchDeclarationById: (id: number) => Promise<void>;
  createDeclaration: (data: DeclarationFormData) => Promise<Declaration>;
  updateDeclaration: (id: number, data: DeclarationFormData) => Promise<void>;
  submitDeclaration: (id: number) => Promise<void>;
  reviewDeclaration: (id: number, data: ReviewData) => Promise<void>;
  clearError: () => void;
  clearCurrent: () => void;
}

export const useDeclarationStore = create<DeclarationState>((set) => ({
  declarations: [],
  currentDeclaration: null,
  isLoading: false,
  error: null,

  fetchMyDeclarations: async () => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      set({ declarations: mockGetMyDeclarations(), isLoading: false });
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.get('/declarations/my');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement des déclarations' });
    }
  },

  fetchPendingDeclarations: async () => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      set({ declarations: mockGetPendingDeclarations(), isLoading: false });
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.get('/declarations/pending');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement' });
    }
  },

  fetchAllDeclarations: async () => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      set({ declarations: mockGetAllDeclarations(), isLoading: false });
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.get('/declarations/all');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement' });
    }
  },

  fetchDeclarationById: async (id: number) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      const decl = mockGetDeclarationById(id);
      set({ currentDeclaration: decl ?? null, isLoading: false, error: decl ? null : 'Déclaration non trouvée' });
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.get(`/declarations/${id}`);
      set({ currentDeclaration: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Déclaration non trouvée' });
    }
  },

  createDeclaration: async (formData: DeclarationFormData) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      const declaration = mockCreateDeclaration(formData);
      set((state) => ({ declarations: [declaration, ...state.declarations], isLoading: false }));
      return declaration;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.post('/declarations', formData);
      set((state) => ({
        declarations: [data.data, ...state.declarations],
        isLoading: false,
      }));
      return data.data;
    } catch {
      set({ isLoading: false, error: 'Erreur lors de la création' });
      throw new Error('Erreur lors de la création');
    }
  },

  updateDeclaration: async (id: number, formData: DeclarationFormData) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      set({ isLoading: false });
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.put(`/declarations/${id}`, formData);
      set((state) => ({
        declarations: state.declarations.map((d) => (d.id === id ? data.data : d)),
        currentDeclaration: data.data,
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false, error: 'Erreur lors de la mise à jour' });
    }
  },

  submitDeclaration: async (id: number) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      const updated = mockSubmitDeclaration(id);
      if (updated) {
        set((state) => ({
          declarations: state.declarations.map((d) => (d.id === id ? updated : d)),
          currentDeclaration: updated,
          isLoading: false,
        }));
      }
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.patch(`/declarations/${id}/submit`);
      set((state) => ({
        declarations: state.declarations.map((d) => (d.id === id ? data.data : d)),
        currentDeclaration: data.data,
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false, error: 'Erreur lors de la soumission' });
    }
  },

  reviewDeclaration: async (id: number, reviewData: ReviewData) => {
    set({ isLoading: true, error: null });
    if (MOCK_MODE) {
      const updated = mockReviewDeclaration(id, reviewData.approved, reviewData.comment);
      if (updated) {
        set((state) => ({
          declarations: state.declarations.map((d) => (d.id === id ? updated : d)),
          currentDeclaration: updated,
          isLoading: false,
        }));
      }
      return;
    }
    const { default: api } = await import('@/api/axios');
    try {
      const { data } = await api.patch(`/declarations/${id}/review`, reviewData);
      set((state) => ({
        declarations: state.declarations.map((d) => (d.id === id ? data.data : d)),
        currentDeclaration: data.data,
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false, error: 'Erreur lors du traitement' });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrent: () => set({ currentDeclaration: null }),
}));
