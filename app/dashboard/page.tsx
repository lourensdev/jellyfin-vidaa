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
import { use, useEffect } from 'react';
import { LatestItems } from '../api/users/latestItems';
import { CollectionType } from '@/@types/collections.types';
import { ImageTypes, getImagePath } from '@/src/utilities/common';
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

  const { data: resumeData } = ResumeItems();

  useEffect(() => {
    if (resumeData) {
      const remappedViews = (resumeData as UsersResumeItemsResponse).Items!.map(
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
            ImageTypes.BACKDROP,
          ),
          progress: item.UserData?.PlayedPercentage || 0,
        }),
      );

      setResumeMedia(remappedViews);
    }
  }, [resumeData]);

  const { data } = LatestItems(views?.map(view => view.id) || null);

  useEffect(() => {
    if (data) {
      (data as UsersLatestItemsResponse[]).forEach(
        (dataItem: UsersLatestItemsResponse) => {
          const remappedViews = dataItem.map(item => ({
            label: item.Name || '',
            id: item.Id || '',
            year: item.ProductionYear || null,
            image: getImagePath(
              item.Id,
              item.ImageTags!.Primary,
              240,
              360,
              ImageTypes.PRIMARY,
            ),
            type: item.Type,
          }));

          const collectionType = remappedViews[0].type;

          if (collectionType === 'Series') {
            setLatestShows(remappedViews);
          } else if (collectionType === 'Movie') {
            setLatestMovies(remappedViews);
          }
        },
      );
    }
  }, [data]);

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        className={`flex flex-col gap-10 ${
          views === null || views.length === 0 ? '' : 'py-8'
        }`}
      >
        {(views === null || views.length === 0) && (
          <PageLoader mode={LoaderStyle.Blue} size={60} />
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
                  path={`detail?id=${media.id}`}
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
                  path={`detail?id=${movie.id}`}
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
                  path={`detail?id=${show.id}`}
                />
              ))}
            </SliderComponent>
          </>
        )}
      </main>
    </FocusContext.Provider>
  );
}
