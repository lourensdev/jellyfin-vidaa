import { create } from 'zustand';
import { useNavigationStore } from './navigation.store';

type ModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  openModal: () => {
    set({ isOpen: true });
    useNavigationStore.setState({ isOnExitModal: true });
  },
  closeModal: () => {
    set({ isOpen: false });
    useNavigationStore.setState({ isOnExitModal: false });
  },
}));
