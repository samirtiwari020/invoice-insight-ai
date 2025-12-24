import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  activeModal: string | null;
  highlightedField: string | null;
  isLoading: boolean;
  loadingMessage: string;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setHighlightedField: (fieldKey: string | null) => void;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  highlightedField: null,
  isLoading: false,
  loadingMessage: '',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setHighlightedField: (fieldKey) => set({ highlightedField: fieldKey }),
  setLoading: (loading, message = 'Loading...') => set({ isLoading: loading, loadingMessage: message }),
}));
