'use client';

import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { CollectionType } from '@/@types/collections.types';
import { useEffect } from 'react';
import { useApiStore } from '@/src/stores/api.store';
import { useSearchParams } from 'next/navigation';
import { useBackNav } from '@/src/hooks/useBackNav';

init({
  debug: false,
  visualDebug: false,
});

export default function StreamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ref, focusKey } = useFocusable();
  const params = useSearchParams();
  const streamId: string | undefined = params.get('id') as CollectionType;
  const { setStreamingId } = useApiStore();

  useBackNav();

  useEffect(() => {
    setStreamingId(streamId);
  }, [streamId]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`w-[100vw] min-h-[100vh] h-full`}>
        {children}
      </div>
    </FocusContext.Provider>
  );
}
