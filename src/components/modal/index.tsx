'use client';

import { useModalStore } from '@/src/stores/modal.store';
import { useNavigationStore } from '@/src/stores/navigation.store';
import { useEffect, useState } from 'react';

interface ModalComponentProps {
  componentFocused: boolean;
}

export default function ModalComponent(props: ModalComponentProps) {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const { pressLeftEvent, pressRightEvent, pressEnterEvent, pressBackEvent } =
    useNavigationStore();
  const { closeModal } = useModalStore();

  useEffect(() => {
    const navigateLeft = () => {
      if (activeButtonIndex > 0 && props.componentFocused) {
        setActiveButtonIndex(activeButtonIndex - 1);
      }
    };
    pressLeftEvent && navigateLeft();
  }, [pressLeftEvent]);

  useEffect(() => {
    const navigateRight = () => {
      if (activeButtonIndex < 1 && props.componentFocused) {
        setActiveButtonIndex(activeButtonIndex + 1);
      }
    };
    pressRightEvent && navigateRight();
  }, [pressRightEvent]);

  useEffect(() => {
    const enterPress = () => {
      if (activeButtonIndex === 0 && props.componentFocused) {
        window.close();
      } else if (activeButtonIndex === 1 && props.componentFocused) {
        closeModal();
      }
    };
    pressEnterEvent && enterPress();
  }, [pressEnterEvent]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-md">
      <div className="bg-white p-14 text-black rounded-lg text-2xl">
        <h2 className="text-4xl mb-4">Exit</h2>
        <p className="mb-10">Are you sure you want to close the app?</p>
        <div className="flex justify-between">
          <button
            className={
              `appearance-none rounded-lg p-4 min-w-40 ` +
              (activeButtonIndex === 0
                ? 'text-white bg-neutral-950'
                : 'bg-neutral-200')
            }
          >
            Yes
          </button>
          <button
            className={
              `appearance-none rounded-lg p-4 min-w-40 ` +
              (activeButtonIndex === 1
                ? 'text-white bg-neutral-950'
                : 'bg-neutral-200')
            }
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
