'use client';

import ModalComponent from '@/src/components/modal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { CollectionType } from '@/@types/collections.types';
import { useModalStore } from '@/src/stores/modal.store';
import { useEffect } from 'react';
import { useApiStore } from '@/src/stores/api.store';
import { useSearchParams } from 'next/navigation';
import { ItemDetail } from '../api/users/itemDetail';
import { UserItemsByIdResponse } from '@/@types/api/user.types';
import { useBackNav } from '@/src/hooks/useBackNav';

init({
  debug: false,
  visualDebug: false,
});

export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ref, focusKey } = useFocusable();
  const params = useSearchParams();
  const mediaId: string | undefined = params.get('id') as CollectionType;
  const { setMediaItem } = useApiStore();
  const { isModalOpen } = useModalStore();

  useBackNav();

  const { data } = ItemDetail(mediaId);

  useEffect(() => {
    setMediaItem(data as UserItemsByIdResponse);
  }, [data]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`w-[100vw] min-h-[100vh] h-full`}>
        {children}
        {isModalOpen && <ModalComponent />}
      </div>
    </FocusContext.Provider>
  );
}
