import { useEffect } from 'react';
import { useModalStore } from '@/src/stores/modal.store';
import { VK_BACK_SPACE } from '@/src/utilities/constants';

export const useModal = () => {
  const { isModalOpen, closeModal, openModal } = useModalStore();

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      switch (ev.keyCode) {
        case VK_BACK_SPACE:
          isModalOpen ? closeModal() : openModal();
          break;
      }
      ev.preventDefault();
    };

    document.addEventListener('keydown', handleKeydown, false);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isModalOpen, closeModal, openModal]);

  return { isModalOpen };
};
