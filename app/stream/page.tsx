'use client';

import { LoaderStyle } from '@/src/components/loader';
import PageLoader from '@/src/components/pageLoader';
import {
  DEVICE_ID,
  SERVER_URL,
  USER_ID,
  USER_TOKEN,
} from '@/src/constants/storage.keys';
import { useApiStore } from '@/src/stores/api.store';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function Stream() {
  const { ref, focusKey, focusSelf } = useFocusable();
  const [loading, setLoading] = useState(true);
  const { streamingId } = useApiStore();

  useEffect(() => {
    focusSelf();
  }, [focusKey]);

  const getVideoUrl = (): string => {
    const server = getCookie(SERVER_URL);
    const token = getCookie(USER_TOKEN);
    const deviceId = getCookie(DEVICE_ID);
    return `${server}/Videos/${streamingId}/stream.mp4?Static=true&mediaSourceId=${streamingId}&deviceId=${deviceId}&api_key=${token}`; //&Tag=9d4f915ef7e377b856c6ce00ad31570f
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        className="flex min-h-[100vh] bg-black"
        key={`${streamingId}-item`}
      >
        {loading && (
          <div className="absolute z-30 top-0 right-0 left-0 bottom-0">
            <PageLoader mode={LoaderStyle.Blue} size={60} />
          </div>
        )}
        <video
          className="w-screen h-screen"
          src={getVideoUrl()}
          controls
          autoPlay
          onPlay={() => setLoading(false)}
        />
      </main>
    </FocusContext.Provider>
  );
}
