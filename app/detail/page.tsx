'use client';

import Button, { ButtonType } from '@/src/components/form/button';
import { useApiStore } from '@/src/stores/api.store';
import { ImageTypes, getImagePath, ticksToTime } from '@/src/utilities/common';
import { Star } from '@material-ui/icons';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Detail() {
  const { ref, focusKey, focusSelf } = useFocusable();
  const { mediaItem } = useApiStore();

  useEffect(() => {
    focusSelf();
  }, [focusKey]);

  const ratings: string[] = [
    mediaItem?.OfficialRating || '',
    mediaItem?.ProductionYear?.toString() || '',
    ticksToTime(mediaItem?.RunTimeTicks) || '',
  ];

  return (
    <FocusContext.Provider value={focusKey}>
      <main ref={ref} className="flex">
        <div className="absolute z-0 top-0 right-0 left-0 bottom-0">
          <div className="absolute z-10 top-0 right-0 left-0 bottom-0 bg-detail-gradient" />
          <Image
            src={getImagePath(
              mediaItem?.Id,
              mediaItem?.BackdropImageTags
                ? mediaItem?.BackdropImageTags[0]
                : mediaItem?.ImageTags?.Primary || '',
              1920,
              1080,
              ImageTypes.BACKDROP,
            )}
            layout="fill"
            objectFit="cover"
            alt={mediaItem?.Name || 'cover image'}
          />
        </div>
        <div className="relative z-20 px-overscan pt-[30vh] pb-8 box-content w-full min-h-full">
          <Image
            src={getImagePath(
              mediaItem?.Id,
              mediaItem?.ImageTags?.Logo || '',
              500,
              500,
              ImageTypes.LOGO,
            )}
            className="pb-8"
            width={500}
            height={500}
            style={{ width: '20vw', height: 'auto' }}
            alt="media item image"
          />
          <div className="lg:w-6/12 md:w-full">
            <p className="opacity-70 text-lg font-light pb-8">
              {mediaItem?.Overview}
            </p>
            <p className="opacity-70 text-lg pb-8">
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
                      <Image
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
              label="Resume"
              type={ButtonType.Primary}
              large={true}
              onEnterPress={() => console.log('watch now')}
              loading={false}
              disabled={false}
            />
          </div>
        </div>
      </main>
    </FocusContext.Provider>
  );
}
