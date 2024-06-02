'use client';

import {
  UsersLatestItemsResponse,
  UsersResumeItemsResponse,
} from '@/@types/api/user.types';
import CardComponent from '@/src/components/card';
import { SliderComponent } from '@/src/components/slider';
import { ApiViewsType, useApiStore } from '@/src/stores/api.store';
import { useFocusStore } from '@/src/stores/focus.store';
import {
  FocusContext,
  setFocus,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';
import { LatestItems } from '../api/users/latestItems';
import { CollectionType } from '@/@types/collections.types';
import { getImagePath } from '@/src/utilities/common';
import { ResumeItems } from '../api/users/resumeItems';

export default function Dashboard() {
  const { lastFocused, setLastFocused } = useFocusStore();
  const {
    views,
    resumeMedia,
    setResumeMedia,
    latestShows,
    setLatestShows,
    latestMovies,
    setLatestMovies,
  } = useApiStore();
  const { ref, focusKey } = useFocusable({
    onFocus: () => {
      if (lastFocused) {
        setTimeout(() => {
          setFocus(lastFocused);
          setLastFocused(null);
        }, 50);
      }
    },
  });

  const getResumeMedia = () => {
    const getResumeItems = async () => {
      const data = await ResumeItems();

      const remappedViews = (data as UsersResumeItemsResponse).Items!.map(
        item => ({
          label: item.Name || '',
          id: item.Id || '',
          year: item.ProductionYear || null,
          image: getImagePath(item.Id, item.ImageTags!.Primary, 240, 360),
          progress: item.UserData?.PlayedPercentage || 0,
        }),
      );

      setResumeMedia(remappedViews);
    };

    getResumeItems();
  };

  const getLatestMedia = (views: ApiViewsType[]) => {
    const getLatestItems = async (view: ApiViewsType) => {
      const data = await LatestItems(view.id);

      const remappedViews = (data as UsersLatestItemsResponse).map(item => ({
        label: item.Name || '',
        id: item.Id || '',
        year: item.ProductionYear || null,
        image: getImagePath(item.Id, item.ImageTags!.Primary, 240, 360),
      }));

      if (view.type === CollectionType.TV_SHOWS) {
        setLatestShows(remappedViews);
      } else {
        setLatestMovies(remappedViews);
      }
    };

    views.forEach(view => getLatestItems(view));
  };

  useEffect(() => {
    if (views) {
      getResumeMedia();
      getLatestMedia(views);
    }
  }, [views]);

  return (
    <FocusContext.Provider value={focusKey}>
      <main ref={ref} className="flex flex-col gap-10 py-8">
        {views && (
          <>
            <h1 className="px-overscan text-4xl">My Media</h1>
            <SliderComponent isFocused={true}>
              {views.map(view => (
                <CardComponent
                  key={view.id}
                  isLandscape={true}
                  isLarge={true}
                  title={view.label}
                  hideTitle={true}
                  hideGradientOverlay={true}
                  image={getImagePath(view.id, view.id, 672, 378)}
                />
              ))}
            </SliderComponent>
          </>
        )}
        {resumeMedia && (
          <>
            <h2 className="px-overscan text-4xl">Continue Watching</h2>
            <SliderComponent>
              {resumeMedia.map(media => (
                <CardComponent
                  key={media.id}
                  title={media.label}
                  image={media.image}
                  year={media.year}
                  hideGradientOverlay={true}
                  progress={media.progress}
                />
              ))}
            </SliderComponent>
          </>
        )}
        {latestMovies && (
          <>
            <h2 className="px-overscan text-4xl">Latest Movies</h2>
            <SliderComponent>
              {latestMovies.map(movie => (
                <CardComponent
                  key={movie.id}
                  title={movie.label}
                  image={movie.image}
                  year={movie.year}
                  hideGradientOverlay={true}
                />
              ))}
            </SliderComponent>
          </>
        )}
        {latestShows && (
          <>
            <h2 className="px-overscan text-4xl">Latest Shows</h2>
            <SliderComponent>
              {latestShows.map(show => (
                <CardComponent
                  key={show.id}
                  title={show.label}
                  image={show.image}
                  year={show.year}
                  hideGradientOverlay={true}
                />
              ))}
            </SliderComponent>
          </>
        )}
      </main>
    </FocusContext.Provider>
  );
}
