'use client';

import ButtonIcon from '@/src/components/controls';
import Button, { ButtonType } from '@/src/components/form/button';
import { LoaderStyle } from '@/src/components/loader';
import PageLoader from '@/src/components/pageLoader';
import PersonCardComponent from '@/src/components/person';
import { SliderComponent } from '@/src/components/slider';
import { useApiStore } from '@/src/stores/api.store';
import { ImageTypes, getImagePath, ticksToTime } from '@/src/utilities/common';
import { ArrowBack, Star } from '@material-ui/icons';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Detail() {
  const router = useRouter();
  const { ref, focusKey, focusSelf } = useFocusable();
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { mediaItem } = useApiStore();

  useEffect(() => {
    focusSelf();
  }, [focusKey]);

  useEffect(() => {
    setBackdropLoaded(false);
    setLogoLoaded(false);
  }, [mediaItem]);

  const ratings: string[] = [
    mediaItem?.OfficialRating || '',
    mediaItem?.ProductionYear?.toString() || '',
    ticksToTime(mediaItem?.RunTimeTicks) || '',
  ];

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        className="flex min-h-[100vh]"
        key={`${mediaItem?.Id}-item`}
      >
        {!backdropLoaded && !logoLoaded && (
          <div className="absolute z-30 top-0 right-0 left-0 bottom-0">
            <PageLoader mode={LoaderStyle.Blue} size={60} />
          </div>
        )}
        <div className="fixed z-0 top-0 right-0 left-0 bottom-0">
          <div className="fixed z-10 top-0 right-0 left-0 bottom-0 bg-detail-gradient" />
          <img
            key={`${mediaItem?.Id}-backdrop`}
            src={getImagePath(
              mediaItem?.Id,
              mediaItem?.BackdropImageTags
                ? mediaItem?.BackdropImageTags[0]
                : mediaItem?.ImageTags?.Primary || '',
              1920,
              1080,
              ImageTypes.BACKDROP,
            )}
            onLoad={() => setBackdropLoaded(true)}
            className={backdropLoaded ? 'opacity-1' : 'opacity-0'}
            loading="lazy"
            alt={mediaItem?.Name || 'cover image'}
          />
        </div>
        <div
          className={`relative z-20 pt-[10vh] pb-[10vh] box-content w-full min-h-[100vh] transition-opacity max-w-[100vw] ${
            logoLoaded ? 'opacity-1' : 'opacity-0'
          }`}
        >
          <div className="pl-overscan pb-8">
            <div className="mt-[-30px] mb-[30px]">
              <ButtonIcon onPress={() => router.back()}>
                <ArrowBack fontSize="large" />
              </ButtonIcon>
            </div>
            <img
              key={`${mediaItem?.Id}-logo`}
              src={getImagePath(
                mediaItem?.Id,
                mediaItem?.ImageTags?.Logo || '',
                500,
                500,
                ImageTypes.LOGO,
              )}
              onLoad={() => setLogoLoaded(true)}
              width={500}
              height={500}
              style={{ width: '20vw', height: 'auto' }}
              loading="lazy"
              alt="media item image"
            />
          </div>
          <div className="lg:w-8/12 md:w-full px-overscan">
            <p className="opacity-70 text-2xl font-light mb-8">
              <strong>{mediaItem?.Taglines && mediaItem?.Taglines[0]}</strong>
            </p>
            <p className="opacity-70 text-2xl font-light mb-8">
              {mediaItem?.Overview}
            </p>
            <p className="opacity-70 text-2xl mb-16">
              <div>
                <strong className="flex items-center gap-1">
                  {ratings.join(' • ')}
                  {mediaItem?.CommunityRating && (
                    <span className="flex items-center gap-1 pl-3 text-yellow-300">
                      <Star />
                      <span className="text-white">
                        {mediaItem?.CommunityRating?.toFixed(1)} 
                      </span>
                    </span>
                  )}
                  {mediaItem?.CriticRating && (
                    <span className="flex items-center gap-1">
                      <img
                        src="/assets/tomato-rating.svg"
                        width={18}
                        height={18}
                        alt="Tomato Rating"
                      />
                      {Math.round(mediaItem?.CriticRating)}
                    </span>
                  )}
                </strong>
              </div>
            </p>
            <Button
              label={
                mediaItem?.UserData?.PlayedPercentage ? 'Resume' : 'Watch Now'
              }
              className="mt-4"
              type={ButtonType.Primary}
              large={true}
              onEnterPress={() => router.push(`/stream?id=${mediaItem?.Id}`)}
              loading={false}
              isFocused={true}
              disabled={false}
              focusBlockPosition="end"
            />
          </div>
          {mediaItem?.People && (
            <>
              <h3 className="text-2xl mt-16 mb-4 pl-overscan">Cast</h3>
              <SliderComponent className="px-overscan">
                {mediaItem?.People.filter(
                  person => person.Type === 'Actor',
                ).map(person => (
                  <PersonCardComponent
                    key={person.Id}
                    name={person.Name || ''}
                    image={getImagePath(
                      person.Id,
                      person.PrimaryImageTag || '',
                      150,
                      225,
                      ImageTypes.PRIMARY,
                    )}
                    role={person.Role || null}
                    type={person.Type || null}
                    width={159}
                    height={225}
                  />
                ))}
              </SliderComponent>
            </>
          )}
        </div>
      </main>
    </FocusContext.Provider>
  );
}
