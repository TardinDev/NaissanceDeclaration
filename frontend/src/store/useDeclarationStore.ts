import { create } from 'zustand';
import api from '@/api/axios';
import type { ApiResponse, Declaration, DeclarationFormData, ReviewData } from '@/types';

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
    try {
      const { data } = await api.get<ApiResponse<Declaration[]>>('/declarations/my');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement des déclarations' });
    }
  },

  fetchPendingDeclarations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ApiResponse<Declaration[]>>('/declarations/pending');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement' });
    }
  },

  fetchAllDeclarations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ApiResponse<Declaration[]>>('/declarations/all');
      set({ declarations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement' });
    }
  },

  fetchDeclarationById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ApiResponse<Declaration>>(`/declarations/${id}`);
      set({ currentDeclaration: data.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Déclaration non trouvée' });
    }
  },

  createDeclaration: async (formData: DeclarationFormData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<Declaration>>('/declarations', formData);
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
    try {
      const { data } = await api.put<ApiResponse<Declaration>>(`/declarations/${id}`, formData);
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
    try {
      const { data } = await api.patch<ApiResponse<Declaration>>(`/declarations/${id}/submit`);
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
    try {
      const { data } = await api.patch<ApiResponse<Declaration>>(`/declarations/${id}/review`, reviewData);
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
