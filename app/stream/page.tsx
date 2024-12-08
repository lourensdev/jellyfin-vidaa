'use client';

import { MediaSourceInfo, PlaybackMediaInfoResponseType } from '@/@types/api/items.types';
import ButtonIcon from '@/src/components/controls';
import HiddenFocusComponent from '@/src/components/focusable';
import { LoaderStyle } from '@/src/components/loader';
import PageLoader from '@/src/components/pageLoader';
import {
  DEVICE_ID,
  SERVER_URL,
  USER_ID,
  USER_TOKEN,
} from '@/src/constants/storage.keys';
import { useBackNav } from '@/src/hooks/useBackNav';
import {
  fetcherPost,
  secondsToTime,
  ticksToSeconds,
} from '@/src/utilities/common';
import {
  ArrowBack,
  Forward10,
  Pause,
  PlayArrow,
  Replay10,
  VolumeOff,
  VolumeUp,
} from '@material-ui/icons';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { getCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { useInterval } from 'usehooks-ts';
import Hls from 'hls.js';
import { CollectionType } from '@/@types/collections.types';
import getDeviceProfile, { Profile } from '@/src/utilities/deviceProfile';

export default function Stream() {
  const { ref, focusKey, focusSelf } = useFocusable({
    onEnterPress: () => {
      setControlsVisible(true);
    },
    onArrowPress: () => {
      setControlsVisible(true);
      return true;
    },
  });
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [firstStart, setFirstStart] = useState(true);
  const [muted, setMuted] = useState(false);
  const player = useRef<any>(null);
  const router = useRouter();

  const params = useSearchParams();
  const streamId: string | undefined = params.get('id') as CollectionType;
  const playbackTicks: string | undefined = params.get('ticks') as CollectionType;

  const userId = getCookie(USER_ID);

  const PATH = `/Items/${streamId}/PlaybackInfo?UserId=${userId}&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MaxStreamingBitrate=140000000`;

  const { data, trigger } = useSWRMutation(PATH, fetcherPost);

  const sessionId = (data as unknown as PlaybackMediaInfoResponseType)?.PlaySessionId;
  const mediaSources: MediaSourceInfo[] | undefined = (data as unknown as PlaybackMediaInfoResponseType)?.MediaSources;
  const transcodeUrl = mediaSources && mediaSources[0].SupportsDirectStream ? mediaSources[0].TranscodingUrl : null;

  const PLAYBACK_PROGRESS_STARTED = {
    CanSeek: true,
    ItemId: streamId,
    IsPaused: !playing,
    IsMuted: muted,
    ...(playbackTicks ? { PositionTicks: parseInt(playbackTicks) } : null),
    PlayMethod: 'Transcode',
    RepeatMode: 'RepeatNone',
    PlaybackOrder: 'Default',
    PlaySessionId: sessionId,
  };

  const PLAYBACK_PROGRESS = {
    CanSeek: true,
    ItemId: streamId,
    IsPaused: !playing,
    IsMuted: muted,
    PositionTicks: currentTime * 10000000,
    PlayMethod: 'Transcode',
    RepeatMode: 'RepeatNone',
    PlaybackOrder: 'Default',
    PlaySessionId: sessionId,
    EventName: !playing ? 'pause' : 'timeupdate',
  };

  const PLAYBACK_PROGRESS_ENDED = {
    CanSeek: true,
    ItemId: streamId,
    IsPaused: true,
    IsMuted: muted,
    PositionTicks: currentTime * 10000000,
    PlayMethod: 'Transcode',
    RepeatMode: 'RepeatNone',
    PlaybackOrder: 'Default',
    PlaySessionId: sessionId,
  };

  const { trigger: sessionPlaying } = useSWRMutation(
    `/Sessions/Playing`,
    fetcherPost,
  );

  const { trigger: sessionProgress } = useSWRMutation(
    `/Sessions/Playing/Progress`,
    fetcherPost,
  );

  const { trigger: sessionStopped } = useSWRMutation(
    `/Sessions/Playing/Stopped`,
    fetcherPost,
  );

  const iconStyles = { width: '50px', height: '50px' };

  const endVideoPlayback = () => {
    sessionStopped(PLAYBACK_PROGRESS_ENDED);
    router.back();
  };

  useEffect(() => {
    if (window !== undefined) {
      getDeviceProfile(document.createElement('video')).then(
        (profile: Profile) => trigger({ DeviceProfile: profile }),
      );
    }
  }, []);

  useBackNav(endVideoPlayback);

  useEffect(() => {
    focusSelf();
  }, [focusKey]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (controlsVisible) {
      timeoutId = setTimeout(() => setControlsVisible(false), 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [controlsVisible]);

  useEffect(() => {
    if (!controlsVisible) {
      focusSelf();
    }
  }, [controlsVisible]);

  useEffect(() => {
    if (firstStart) {
      sessionPlaying(PLAYBACK_PROGRESS_STARTED);
      setFirstStart(false);
    }
  }, [playing]);

  useEffect(() => {
    setVideoUrl();
  }, []);

  useInterval(
    () => {
      sessionProgress(PLAYBACK_PROGRESS);
    },
    playing ? 10000 : null,
  );

  const playVideo = () => {
    player.current.play();
  };

  const pauseVideo = () => {
    player.current.pause();
  };

  const togglePlaying = () => {
    if (playing) {
      pauseVideo();
    } else {
      playVideo();
    }
    setPlaying(!playing);
  };

  const skipBackward = () => {
    player.current.currentTime -= 10;
  };

  const skipForward = () => {
    player.current.currentTime += 10;
  };

  const toggleMute = () => {
    player.current.muted = !player.current.muted;
    setMuted(!muted);
  };

  const getCurrentTime = () => {
    if (!currentTime) return '00:00:00';
    return secondsToTime(currentTime);
  };

  const checkContinueTime = () => {
    if (playbackTicks && firstStart) {
      const seconds = ticksToSeconds(parseInt(playbackTicks));
      if (seconds) {
        player.current.currentTime = seconds;
      }
    }
  };

  const getTimeRemaining = () => {
    if (!player.current) return '00:00:00';
    const difference = player.current.duration - currentTime;
    return isNaN(difference)
      ? '00:00:00'
      : secondsToTime(Math.round(difference));
  };

  const getVideoProgressPercentage = () => {
    if (!player.current) return 100; // Needs to be inverted
    const currentPercentageRounded =
      (currentTime / player.current.duration) * 100;
    const percentageInverted = 100 - currentPercentageRounded; // Inverted so it works for negative css translate
    return percentageInverted;
  };

  const getFormat = () => {
    if (!mediaSources) return 'mp4';
    return mediaSources[0].Container?.split(',')[0] || 'mp4';
  };

  const setVideoUrl = () => {
    const server = getCookie(SERVER_URL);
    const token = getCookie(USER_TOKEN);
    const deviceId = getCookie(DEVICE_ID);

    if (!transcodeUrl) {
      player.current.src = `${server}/Videos/${streamId}/stream.${getFormat()}?static=true&mediaSourceId=${streamId}&deviceId=${deviceId}&api_key=${token}`;
      playVideo();
    } else {
      const hls = new Hls();
      hls.loadSource(transcodeUrl);
      hls.attachMedia(player.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        playVideo();
      });
    }
  };

  const getEndsAtTime = () => {
    if (!player.current) return '00:00';
    // Take current device time and add the duration of the video
    // Return the time in HH:MM format
    const currentTime = new Date();
    const videoDuration = player.current.duration;
    currentTime.setSeconds(currentTime.getSeconds() + videoDuration);
    const endsAtTime = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return endsAtTime === 'Invalid Date' ? '' : `Ends at ${endsAtTime}`;
  };

  const renderProgressBar = () => {
    return (
      <div className="flex items-center px-16 pb-8">
        <div className="w-28 text-2xl text-left">{getCurrentTime()}</div>
        <div className="flex-1">
          <div className="bg-white/10 rounded-md h-2 overflow-hidden">
            <div
              className="bg-white rounded-md h-full w-full transition-transform"
              style={{
                transform:
                  currentTime > 0
                    ? `translateX(-${getVideoProgressPercentage()}%)`
                    : 'translateX(-100%)',
              }}
            ></div>
          </div>
        </div>
        <div className="w-28 text-2xl text-right">{getTimeRemaining()}</div>
      </div>
    );
  };

  const renderControls = () => {
    return (
      <>
        <ButtonIcon
          onPress={() => togglePlaying()}
          onFocus={() => setControlsVisible(true)}
        >
          {playing ? (
            <Pause fontSize="large" style={iconStyles} />
          ) : (
            <PlayArrow fontSize="large" style={iconStyles} />
          )}
        </ButtonIcon>
        <ButtonIcon
          onPress={() => skipBackward()}
          onFocus={() => setControlsVisible(true)}
        >
          <Replay10 fontSize="large" style={iconStyles} />
        </ButtonIcon>
        <ButtonIcon
          onPress={() => skipForward()}
          onFocus={() => setControlsVisible(true)}
        >
          <Forward10 fontSize="large" style={iconStyles} />
        </ButtonIcon>
        <ButtonIcon
          onPress={() => toggleMute()}
          onFocus={() => setControlsVisible(true)}
        >
          {muted ? (
            <VolumeOff fontSize="large" style={iconStyles} />
          ) : (
            <VolumeUp fontSize="large" style={iconStyles} />
          )}
        </ButtonIcon>
      </>
    );
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        className="flex min-h-[100vh] bg-black"
        key={`${streamId}-item`}
      >
        {loading && (
          <div className="absolute z-30 top-0 right-0 left-0 bottom-0">
            <PageLoader mode={LoaderStyle.Blue} size={60} />
          </div>
        )}
        {controlsVisible && (
          <>
            <div className={`fixed z-20 top-0 left-0 p-16`}>
              <ButtonIcon
                onPress={endVideoPlayback}
                onFocus={() => setControlsVisible(true)}
              >
                <ArrowBack fontSize="large" />
              </ButtonIcon>
            </div>
            <div
              className={`fixed left-0 right-0 bottom-0 z-20 transition-opacity`}
            >
              {renderProgressBar()}
              <div className="flex items-center justify-between px-16 pb-16">
                <HiddenFocusComponent className="flex gap-4">
                  {renderControls()}
                </HiddenFocusComponent>
                <div className="flex-grow text-right text-2xl">
                  {getEndsAtTime()}
                </div>
              </div>
            </div>
          </>
        )}
        <video
          ref={player}
          className="w-screen h-screen"
          onPlay={() => {
            setLoading(false);
            setPlaying(true);
            checkContinueTime();
          }}
          onTimeUpdate={() => {
            setCurrentTime(Math.round(player.current.currentTime));
          }}
          onEnded={() => {
            setPlaying(false);
            endVideoPlayback();
          }}
        />
      </main>
    </FocusContext.Provider>
  );
}
