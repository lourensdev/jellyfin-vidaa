'use client';

import ModalComponent from '@/src/components/modal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import Dashboard from './page';
import { NavBar } from '@/src/components/navbar';
import NavItem from '@/src/components/navitem';
import { CollectionType } from '@/@types/collections.types';
import { useModalStore } from '@/src/stores/modal.store';
import { useNavbar } from '@/src/hooks/useNavbar';
import { useEffect } from 'react';
import { Views } from '../api/users/views';
import { useApiStore } from '@/src/stores/api.store';
import { UsersViewsResponse } from '@/@types/api/user.types';

init({
  debug: false,
  visualDebug: false,
});

export default function DasbhboardLayout() {
  const { ref, focusKey } = useFocusable();

  const { isNavbarOpen } = useNavbar();
  const { isModalOpen } = useModalStore();
  const { views, setViews } = useApiStore();

  useEffect(() => {
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
  }, []);

  const renderViewItems = () => {
    return views
      ? views.map(view => (
          <NavItem key={view.id} title={view.label} type={view.type} />
        ))
      : null;
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`layout ${isNavbarOpen ? 'focused' : ''}`}>
        <div className="navbar">
          {isNavbarOpen && (
            <NavBar>
              <>{renderViewItems()}</>
              <div className="flex-grow" />
              <NavItem title="Exit" isExit={true} />
            </NavBar>
          )}
        </div>
        <div className="content">
          <Dashboard />
          {isModalOpen && <ModalComponent />}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
