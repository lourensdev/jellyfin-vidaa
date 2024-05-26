'use client';

import { useModalStore } from '@/src/stores/modal.store';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import Button from '../button';
import { useEffect } from 'react';

export default function ModalComponent() {
  const { ref, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ['up', 'down'],
  });
  const { closeModal } = useModalStore();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-md"
      >
        <div className="bg-white p-14 text-black rounded-lg text-2xl">
          <h2 className="text-4xl mb-4">Exit</h2>
          <p className="mb-10">Are you sure you want to close the app?</p>
          <div className="flex justify-between">
            <Button label={'Yes'} onEnterPress={window.close} />
            <Button label={'No'} onEnterPress={() => closeModal()} />
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
