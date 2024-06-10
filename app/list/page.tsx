'use client';

import { UsersItemsByTypeResponse } from '@/@types/api/user.types';
import CardComponent from '@/src/components/card';
import { useApiStore } from '@/src/stores/api.store';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';
import { getImagePath } from '@/src/utilities/common';
import { ItemsByType } from '../api/users/itemsByType';
import { GridComponent } from '@/src/components/grid';
import PageLoader from '@/src/components/pageLoader';
import { LoaderStyle } from '@/src/components/loader';
import { CollectionType } from '@/@types/collections.types';

export default function Dashboard() {
  const { views, activeView, allMediaByType, setAllMediaByType } =
    useApiStore();
  const { ref, focusKey } = useFocusable();

  const getAllMediaByType = () => {
    setAllMediaByType([]);

    const getAllItemsByType = async () => {
      const view = views?.find(view => view.type === activeView);
      const data = await ItemsByType(view!.label, view!.id);

      const filterOutFolders = (data as UsersItemsByTypeResponse).Items!.filter(
        item =>
          view?.type === CollectionType.MOVIES ? !item.IsFolder : item.IsFolder,
      );

      const remappedViews = filterOutFolders.map(item => ({
        label: item.Name || '',
        id: item.Id || '',
        year: item.ProductionYear || null,
        image: getImagePath(item.Id, item.ImageTags!.Primary, 240, 360),
      }));

      setAllMediaByType(remappedViews);
    };

    getAllItemsByType();
  };

  useEffect(() => {
    if (activeView && views) {
      getAllMediaByType();
    }
  }, [activeView, views]);

  const getViewTitle = () => {
    return views?.find(view => view.type === activeView)?.label;
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <main ref={ref} className="flex flex-col gap-10 py-8">
        {allMediaByType === null ||
          (allMediaByType.length === 0 && (
            <PageLoader mode={LoaderStyle.Blue} size={40} />
          ))}
        {allMediaByType && (
          <>
            <h2 className="px-overscan text-4xl">{getViewTitle()}</h2>
            <GridComponent isFocused={allMediaByType.length !== 0}>
              {allMediaByType.map(movie => (
                <CardComponent
                  key={movie.id}
                  title={movie.label}
                  image={movie.image}
                  year={movie.year}
                  showTitleAlways={true}
                  hideGradientOverlay={true}
                  isGridCard={true}
                  width={240}
                  height={360}
                />
              ))}
            </GridComponent>
          </>
        )}
      </main>
    </FocusContext.Provider>
  );
}
