'use client';

import ModalComponent from '@/src/components/modal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useModalStore } from '@/src/stores/modal.store';
import { useBackNav } from '@/src/hooks/useBackNav';
import Detail from './page';

init({
  debug: false,
  visualDebug: false,
});
export default function DetailLayout() {
  const { ref, focusKey } = useFocusable();
  const { isModalOpen } = useModalStore();

  useBackNav();

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`w-[100vw] min-h-[100vh] h-full`}>
        <Detail />
        {isModalOpen && <ModalComponent />}
      </div>
    </FocusContext.Provider>
  );
}
