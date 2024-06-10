'use client';

import {
  UsersLatestItemsResponse,
  UsersResumeItemsResponse,
} from '@/@types/api/user.types';
import CardComponent from '@/src/components/card';
import { SliderComponent } from '@/src/components/slider';
import { ApiViewsType, useApiStore } from '@/src/stores/api.store';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';
import { LatestItems } from '../api/users/latestItems';
import { CollectionType } from '@/@types/collections.types';
import { getImagePath } from '@/src/utilities/common';
import { ResumeItems } from '../api/users/resumeItems';
import PageLoader from '@/src/components/pageLoader';
import { LoaderStyle } from '@/src/components/loader';

export default function Dashboard() {
  const {
    views,
    resumeMedia,
    setResumeMedia,
    latestShows,
    setLatestShows,
    latestMovies,
    setLatestMovies,
  } = useApiStore();
  const { ref, focusKey } = useFocusable();

  const getResumeMedia = () => {
    const getResumeItems = async () => {
      const data = await ResumeItems();

      const remappedViews = (data as UsersResumeItemsResponse).Items!.map(
        item => ({
          label: item.SeriesName
            ? `${item.SeriesName}: ${item.Name}`
            : item.Name || '',
          id: item.Id || '',
          year: item.ProductionYear || null,
          image: getImagePath(
            item.ParentBackdropItemId ? item.ParentBackdropItemId : item.Id,
            item.ParentBackdropImageTags
              ? item.ParentBackdropImageTags[0]
              : item.ImageTags!.Primary,
            360,
            240,
            true,
          ),
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
        image: getImagePath(item.Id, item.ImageTags!.Primary, 240, 360, false),
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
      <main
        ref={ref}
        className={`flex flex-col gap-10 ${
          views === null || views.length === 0 ? '' : 'py-8'
        }`}
      >
        {(views === null || views.length === 0) && (
          <PageLoader mode={LoaderStyle.Blue} size={40} />
        )}
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
                  width={672}
                  height={378}
                  path={`/list?view=${view.type}`}
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
                  isLandscape={true}
                  title={media.label}
                  image={media.image}
                  year={media.year}
                  hideGradientOverlay={true}
                  progress={media.progress}
                  width={360}
                  height={240}
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
                  width={240}
                  height={360}
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
                  width={240}
                  height={360}
                />
              ))}
            </SliderComponent>
          </>
        )}
      </main>
    </FocusContext.Provider>
  );
}
