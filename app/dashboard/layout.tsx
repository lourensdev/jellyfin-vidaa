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

init({
  debug: false,
  visualDebug: false,
});

export default function DasbhboardLayout() {
  const { ref, focusKey } = useFocusable();

  const { isNavbarOpen } = useNavbar();
  const { isModalOpen } = useModalStore();

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`layout ${isNavbarOpen ? 'focused' : ''}`}>
        <div className="navbar">
          {isNavbarOpen && (
            <NavBar>
              <NavItem title="TV Series" type={CollectionType.TV_SHOWS} />
              <NavItem title="Movies" type={CollectionType.MOVIES} />
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
