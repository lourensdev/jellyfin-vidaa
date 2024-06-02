'use client';

import { CollectionType } from '@/@types/collections.types';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Tv } from '@material-ui/icons';
import { Theaters } from '@material-ui/icons';
import { useCallback, useEffect } from 'react';

export interface CardComponentProps {
  title: string;
  type?: CollectionType;
  isFocused?: boolean;
}

export default function NavItem({ title, type }: CardComponentProps) {
  const { ref, focused } = useFocusable();

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
      className={`rounded-3xl py-3 px-8 w-60 flex gap-3 justify-start ${
        focused ? 'bg-white text-black' : ''
      }`}
    >
      {type && renderIcon(type)}
      {title}
    </div>
  );
}
