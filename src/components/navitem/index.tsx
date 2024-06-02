'use client';

import { CollectionType } from '@/@types/collections.types';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Tv, Theaters, ExitToApp } from '@material-ui/icons';
import { useEffect } from 'react';
import { useModalStore } from '@/src/stores/modal.store';

export interface CardComponentProps {
  title: string;
  type?: CollectionType;
  isExit?: boolean;
}

export default function NavItem({ title, type, isExit }: CardComponentProps) {
  const { openModal } = useModalStore();
  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      isExit && openModal();
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
      default:
        return <></>;
    }
  };

  return (
    <div
      ref={ref}
      className={`rounded-3xl py-3 px-8 w-60 flex gap-3 justify-start items-center ${
        isExit ? 'text-xl' : 'text-2xl'
      } ${focused ? 'bg-white text-black' : ''}`}
    >
      {type ? renderIcon(type) : <ExitToApp />}
      {title}
    </div>
  );
}
