import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIStore {
  theme: Theme;
  sidebarOpen: boolean;
  activeModal: string | null;
  highlightedField: string | null;
  isLoading: boolean;
  loadingMessage: string;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setHighlightedField: (fieldKey: string | null) => void;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: true,
      activeModal: null,
      highlightedField: null,
      isLoading: false,
      loadingMessage: '',

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        set({ theme: newTheme });
      },
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
      setHighlightedField: (fieldKey) => set({ highlightedField: fieldKey }),
      setLoading: (loading, message = 'Loading...') => set({ isLoading: loading, loadingMessage: message }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
