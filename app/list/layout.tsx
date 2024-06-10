'use client';

import ModalComponent from '@/src/components/modal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { NavBar } from '@/src/components/navbar';
import NavItem from '@/src/components/navitem';
import { CollectionType } from '@/@types/collections.types';
import { useModalStore } from '@/src/stores/modal.store';
import { useNavbar } from '@/src/hooks/useNavbar';
import { useEffect } from 'react';
import { useApiStore } from '@/src/stores/api.store';
import { UsersViewsResponse } from '@/@types/api/user.types';
import { Views } from '@/app/api/users/views';
import { useSearchParams } from 'next/navigation';

init({
  debug: false,
  visualDebug: false,
});

export default function ListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ref, focusKey } = useFocusable();
  const params = useSearchParams();

  const { isNavbarOpen } = useNavbar();
  const { isModalOpen } = useModalStore();
  const { views, setViews, activeView, setActiveView } = useApiStore();

  const checkParams = () => {
    const currentView: CollectionType | undefined = params.get(
      'view',
    ) as CollectionType;
    if (currentView && activeView !== currentView) {
      setActiveView(currentView);
    }
  };

  useEffect(() => {
    checkParams();
  }, [params]);

  useEffect(() => {
    if (views !== null && activeView !== null) return;
    const getViews = async () => {
      const data = await Views();

      const remappedViews = (data as UsersViewsResponse).Items!.map(item => ({
        label: item.Name || '',
        id: item.Id || '',
        type: (item.CollectionType as CollectionType) || '',
      }));

      setViews(remappedViews);
    };

    getViews();
  }, [views, activeView]);

  const renderViewItems = () => {
    return views
      ? views.map(view => (
          <NavItem
            key={view.id}
            title={view.label}
            type={view.type}
            active={view.type == activeView}
          />
        ))
      : null;
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`layout ${isNavbarOpen ? 'focused' : ''}`}>
        <div className="navbar">
          {isNavbarOpen && (
            <NavBar>
              <NavItem title="Home" type={CollectionType.HOME} />
              <>{renderViewItems()}</>
              <div className="flex-grow" />
              <NavItem title="Exit" isExit={true} />
            </NavBar>
          )}
        </div>
        <div className="content" key={activeView}>
          {children}
          {isModalOpen && <ModalComponent />}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
