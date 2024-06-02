import { useEffect } from 'react';
import { VK_BACK_SPACE } from '@/src/utilities/constants';
import { useNavbarStore } from '../stores/navbar.store';

export const useNavbar = () => {
  const { isNavbarOpen, closeNavbar, openNavbar } = useNavbarStore();

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      switch (ev.keyCode) {
        case VK_BACK_SPACE:
          isNavbarOpen ? closeNavbar() : openNavbar();
          break;
      }
      ev.preventDefault();
    };

    document.addEventListener('keydown', handleKeydown, false);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isNavbarOpen, closeNavbar, openNavbar]);

  return { isNavbarOpen, closeNavbar, openNavbar };
};
