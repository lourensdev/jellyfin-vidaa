import { create } from 'zustand';

type FocusState = {
  lastFocused: string | null;
  setLastFocused: (state: string | null) => void;
};

export const useFocusStore = create<FocusState>((set, get) => ({
  lastFocused: null,
  setLastFocused: (value: string | null) => {
    set({ lastFocused: value });
  },
}));
