import { useEffect } from 'react';
import { VK_BACK_SPACE } from '@/src/utilities/constants';
import { useRouter } from 'next/navigation';

export const useBackNav = (callback?: Function) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      switch (ev.keyCode) {
        case VK_BACK_SPACE:
          callback ? callback() : router.back();
          break;
      }
      ev.preventDefault();
    };

    document.addEventListener('keydown', handleKeydown, false);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);
};
