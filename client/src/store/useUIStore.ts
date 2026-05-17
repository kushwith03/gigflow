import { create } from 'zustand';

interface UIState {
  // Add UI state here if needed in the future
}

export const useUIStore = create<UIState>(() => ({
  // Empty for now, as theme management moved to ThemeProvider
}));
