'use client';

import { CollectionType } from '@/@types/collections.types';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Tv, Theaters, ExitToApp, Home } from '@material-ui/icons';
import { useEffect } from 'react';
import { useModalStore } from '@/src/stores/modal.store';
import { useRouter } from 'next/navigation';

export interface CardComponentProps {
  title: string;
  type?: CollectionType;
  active?: boolean;
  isExit?: boolean;
}

export default function NavItem({
  title,
  type,
  active,
  isExit,
}: CardComponentProps) {
  const router = useRouter();
  const { openModal } = useModalStore();
  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      if (isExit) {
        openModal();
      } else {
        const path =
          type !== CollectionType.HOME ? `/list/?view=${type}` : '/dashboard';
        router.push(path);
      }
    },
  });

  useEffect(() => {
    if (focused) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [ref, focused]);

  const renderIcon = (type: CollectionType) => {
    switch (type) {
      case CollectionType.TV_SHOWS:
        return <Tv />;
      case CollectionType.MOVIES:
        return <Theaters />;
      case CollectionType.HOME:
      default:
        return <Home />;
    }
  };

  return (
    <div
      ref={ref}
      className={`rounded-3xl py-2 px-8 w-60 flex gap-3 justify-start items-center border-4 border-transparent ${
        isExit ? 'text-xl' : 'text-2xl'
      } ${focused ? 'bg-white text-black' : ''}
       ${active && !focused ? 'border-white' : ''}`}
    >
      {type ? renderIcon(type) : <ExitToApp />}
      {title}
    </div>
  );
}
