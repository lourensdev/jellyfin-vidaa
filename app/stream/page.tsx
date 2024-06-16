'use client';

import ButtonIcon from '@/src/components/controls';
import { LoaderStyle } from '@/src/components/loader';
import PageLoader from '@/src/components/pageLoader';
import {
  DEVICE_ID,
  SERVER_URL,
  USER_TOKEN,
} from '@/src/constants/storage.keys';
import { useBackNav } from '@/src/hooks/useBackNav';
import { useApiStore } from '@/src/stores/api.store';
import { secondsToTime } from '@/src/utilities/common';
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
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Stream() {
  const { ref, focusKey, focusSelf } = useFocusable();
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const { streamingId } = useApiStore();
  const player = useRef<any>(null);
  const router = useRouter();

  useBackNav();

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
    player.current.currentTime -= 100;
  };

  const skipForward = () => {
    player.current.currentTime += 100;
  };

  const toggleMute = () => {
    player.current.muted = !player.current.muted;
    setMuted(!muted);
  };

  const getCurrentTime = () => {
    if (!currentTime) return '00:00:00';
    return secondsToTime(currentTime);
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

  const getVideoUrl = (): string => {
    const server = getCookie(SERVER_URL);
    const token = getCookie(USER_TOKEN);
    const deviceId = getCookie(DEVICE_ID);
    return `${server}/Videos/${streamingId}/stream.mp4?Static=true&mediaSourceId=${streamingId}&deviceId=${deviceId}&api_key=${token}`;
  };

  const getEndsAtTime = () => {
    if (!player.current) return '00:00';
    // Take current device time and add the duration of the video
    // Return the time in HH:MM format
    const currentTime = new Date();
    const videoDuration = player.current.duration;
    currentTime.setSeconds(currentTime.getSeconds() + videoDuration);
    return currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderProgressBar = () => {
    return (
      <div className="flex items-center px-16 pb-8">
        <div className="w-20 text-lg text-left">{getCurrentTime()}</div>
        <div className="flex-1">
          <div className="bg-white/10 rounded-md h-2 overflow-hidden">
            <div
              className="bg-white rounded-md h-full w-full transition-transform"
              style={{
                transform: playing
                  ? `translateX(-${getVideoProgressPercentage()}%)`
                  : 'translateX(-100%)',
              }}
            ></div>
          </div>
        </div>
        <div className="w-20 text-lg text-right">{getTimeRemaining()}</div>
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
            <Pause fontSize="large" />
          ) : (
            <PlayArrow fontSize="large" />
          )}
        </ButtonIcon>
        <ButtonIcon
          onPress={() => skipBackward()}
          onFocus={() => setControlsVisible(true)}
        >
          <Replay10 fontSize="large" />
        </ButtonIcon>
        <ButtonIcon
          onPress={() => skipForward()}
          onFocus={() => setControlsVisible(true)}
        >
          <Forward10 fontSize="large" />
        </ButtonIcon>
        <ButtonIcon
          onPress={() => toggleMute()}
          onFocus={() => setControlsVisible(true)}
        >
          {muted ? (
            <VolumeOff fontSize="large" />
          ) : (
            <VolumeUp fontSize="large" />
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
        key={`${streamingId}-item`}
      >
        {loading && (
          <div className="absolute z-30 top-0 right-0 left-0 bottom-0">
            <PageLoader mode={LoaderStyle.Blue} size={60} />
          </div>
        )}
        <div
          className={`fixed z-20 top-0 left-0 p-16 ${
            controlsVisible ? 'opacity-1' : 'opacity-0'
          }`}
        >
          <ButtonIcon
            onPress={() => router.back()}
            onFocus={() => setControlsVisible(true)}
          >
            <ArrowBack fontSize="large" />
          </ButtonIcon>
        </div>
        <div
          className={`fixed left-0 right-0 bottom-0 z-20 transition-opacity ${
            controlsVisible ? 'opacity-1' : 'opacity-0'
          }`}
        >
          {renderProgressBar()}
          <div className="flex items-center justify-between px-16 pb-16">
            <div className="flex gap-4">{renderControls()}</div>
            <div className="flex-grow text-right">
              Ends at {getEndsAtTime()}
            </div>
          </div>
        </div>
        <video
          ref={player}
          className="w-screen h-screen"
          src={getVideoUrl()}
          autoPlay
          onPlay={() => {
            setLoading(false);
            setPlaying(true);
          }}
          onTimeUpdate={() => {
            setCurrentTime(Math.round(player.current.currentTime));
          }}
          onEnded={() => {
            setPlaying(false);
            router.back();
          }}
        />
      </main>
    </FocusContext.Provider>
  );
}
