import { create } from 'zustand';

type ModalState = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set, get) => ({
  isModalOpen: false,
  openModal: () => {
    set({ isModalOpen: true });
  },
  closeModal: () => {
    set({ isModalOpen: false });
  },
}));
