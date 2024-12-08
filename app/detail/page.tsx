'use client';

import { UserItemsByIdResponse } from '@/@types/api/user.types';
import ButtonIcon from '@/src/components/controls';
import Button, { ButtonType } from '@/src/components/form/button';
import { LoaderStyle } from '@/src/components/loader';
import PageLoader from '@/src/components/pageLoader';
import PersonCardComponent from '@/src/components/person';
import { SliderComponent } from '@/src/components/slider';
import { ImageTypes, getImagePath, ticksToTime } from '@/src/utilities/common';
import { ArrowBack, Star } from '@material-ui/icons';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ItemDetail } from '../api/users/itemDetail';
import { CollectionType } from '@/@types/collections.types';

export default function Detail() {
  const router = useRouter();
  const { ref, focusKey, focusSelf } = useFocusable();
  const [hasNoLogo, setHasNoLogo] = useState(false);

  const params = useSearchParams();
  const mediaId: string | undefined = params.get('id') as CollectionType;
  const { data } = ItemDetail(mediaId);
  const mediaItem = data as UserItemsByIdResponse;  
  const hasResume = mediaItem?.UserData?.PlayedPercentage;

  useEffect(() => {
    focusSelf();
  }, [focusKey]);
  
  useEffect(() => {
    setHasNoLogo(false);
  }, [mediaItem?.Id]);

  const ratings = (): string[] => {
    let list: string[] = [];
    if (mediaItem?.OfficialRating) list.push(mediaItem?.OfficialRating);
    if (mediaItem?.ProductionYear)
      list.push(mediaItem?.ProductionYear.toString());
    if (mediaItem?.RunTimeTicks)
      list.push(ticksToTime(mediaItem?.RunTimeTicks) as string);
    return list;
  };

  const isSeriesDetail = mediaItem?.Type === 'Series';
  const isEpisodeDetail = mediaItem?.Type === 'Episode';

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        className="flex min-h-[100vh]"
        key={`${mediaItem?.Id}-item`}
      >
        {!mediaItem && (
          <div className="absolute z-30 top-0 right-0 left-0 bottom-0">
            <PageLoader mode={LoaderStyle.Blue} size={60} />
          </div>
        )}
        <div className="fixed z-0 top-0 right-0 left-0 bottom-0">
          <div className="fixed z-10 top-0 right-0 left-0 bottom-0 bg-detail-gradient" />
          <img
            key={`${mediaItem?.Id}-backdrop`}
            src={getImagePath(
              mediaItem?.SeriesId || mediaItem?.Id,
              mediaItem?.BackdropImageTags
                ? mediaItem?.BackdropImageTags[0]
                : mediaItem?.ImageTags?.Primary || '',
              1920,
              1080,
              ImageTypes.BACKDROP,
            )}
            onError={e => e.currentTarget.remove()}
            width={'auto'}
            loading="lazy"
            alt={mediaItem?.Name || 'cover image'}
          />
        </div>
        <div
          className={`relative z-20 pt-[10vh] pb-[10vh] box-content w-full min-h-[100vh] transition-opacity max-w-[100vw]`}
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
                mediaItem?.SeriesId || mediaItem?.Id,
                mediaItem?.ImageTags?.Logo || '',
                500,
                500,
                ImageTypes.LOGO,
              )}
              width={500}
              height={500}
              onError={e => {
                setHasNoLogo(true);
                e.currentTarget.remove();
              }}
              style={{ width: '20vw', height: 'auto' }}
              loading="lazy"
              alt="media item image"
            />
          </div>
          <div className="lg:w-8/12 md:w-full px-overscan">
            <div className="flex gap-10">
              {hasNoLogo && <div>
                  <img
                    key={`${mediaItem?.Id}-poster`}
                    src={getImagePath(
                      mediaItem?.SeriesId || mediaItem?.Id,
                      mediaItem?.ImageTags?.Primary || '',
                      500,
                      500,
                      ImageTypes.PRIMARY,
                    )}
                    width={301}
                    height={444}
                    style={{ minWidth: '301px', height: 'auto' }}
                    loading="lazy"
                    alt="media item image"
                  />
              </div>}
              <div>
                {hasNoLogo && (
                  <h1 className="text-4xl text-white mb-8">
                    {mediaItem?.Name}
                  </h1>
                )}
                {isEpisodeDetail && (
                  <p className="text-2xl mb-8">
                    <strong>
                      Ep. {mediaItem?.IndexNumber} - {mediaItem?.Name}
                    </strong>
                  </p>
                )}
                <p className="opacity-70 text-2xl font-light mb-8">
                  {mediaItem?.Overview}
                </p>
                <p className="opacity-70 text-2xl mb-16">
                  <div>
                    <strong className="flex items-center gap-1">
                      {ratings().join(' • ')}
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
                {!isSeriesDetail && (
                  <Button
                    label={hasResume ? 'Resume' : 'Watch Now'}
                    className="mt-4"
                    type={ButtonType.Primary}
                    large={true}
                    onEnterPress={() =>
                      router.push(
                        `/stream?id=${mediaItem?.Id}${
                          hasResume
                            ? `&ticks=${mediaItem?.UserData?.PlaybackPositionTicks}`
                            : ''
                        }`,
                      )
                    }
                    loading={false}
                    isFocused={true}
                    disabled={false}
                    focusBlockPosition="end"
                  />
                )}
              </div>
            </div>
          </div>
          {mediaItem?.People && mediaItem?.People.length > 0 && (
            <>
              <h3 className="text-2xl mt-16 mb-4 pl-overscan">Cast</h3>
              <SliderComponent className="px-overscan">
                {mediaItem?.People.filter(person =>
                  isSeriesDetail
                    ? true
                    : person.Type === 'Actor' || person.Type === 'GuestStar',
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
