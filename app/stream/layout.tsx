'use client';

import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { CollectionType } from '@/@types/collections.types';
import { useSearchParams } from 'next/navigation';
import { useBackNav } from '@/src/hooks/useBackNav';
import Stream from './page';
import {
  MediaSourceInfo,
  PlaybackMediaInfoResponseType,
} from '@/@types/api/items.types';
import { DEVICE_ID, SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { getCookie } from 'cookies-next';
import useSWRMutation from 'swr/mutation';
import { fetcherPost } from '@/src/utilities/common';
import { useEffect } from 'react';
import getDeviceProfile, { Profile } from '@/src/utilities/deviceProfile';

init({
  debug: false,
  visualDebug: false,
});

export default function StreamLayout() {
  const { ref, focusKey } = useFocusable();
  const params = useSearchParams();
  const streamId: string | undefined = params.get('id') as CollectionType;
  const ticks: string | undefined = params.get('ticks') as CollectionType;

  const userId = getCookie(USER_ID);

  const PATH = `/Items/${streamId}/PlaybackInfo?UserId=${userId}&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MaxStreamingBitrate=140000000`;

  const { data, trigger } = useSWRMutation(PATH, fetcherPost);

  useEffect(() => {
    if (window !== undefined) {
      getDeviceProfile(document.createElement('video')).then(
        (profile: Profile) => trigger({ DeviceProfile: profile }),
      );
    }
  }, []);

  useBackNav();

  const sessionId = (data as unknown as PlaybackMediaInfoResponseType)
    ?.PlaySessionId;
  const mediaSources: MediaSourceInfo[] | undefined = (
    data as unknown as PlaybackMediaInfoResponseType
  )?.MediaSources;
  const transcodeUrl = mediaSources && mediaSources[0].SupportsDirectStream ? mediaSources[0].TranscodingUrl : null;

  console.log({ data, sessionId, transcodeUrl, mediaSources });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`w-[100vw] min-h-[100vh] h-full`}>
        {sessionId && (
          <Stream
            itemId={streamId}
            mediaSources={
              (data as unknown as PlaybackMediaInfoResponseType)?.MediaSources
            }
            playbackTicks={ticks}
            transcodeUrl={transcodeUrl}
            sessionId={sessionId}
          />
        )}
      </div>
    </FocusContext.Provider>
  );
}
