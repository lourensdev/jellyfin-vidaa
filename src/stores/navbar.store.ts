import { create } from 'zustand';

type NavbarState = {
  isNavbarOpen: boolean;
  openNavbar: () => void;
  closeNavbar: () => void;
};

export const useNavbarStore = create<NavbarState>((set, get) => ({
  isNavbarOpen: false,
  openNavbar: () => {
    set({ isNavbarOpen: true });
  },
  closeNavbar: () => {
    set({ isNavbarOpen: false });
  },
}));
