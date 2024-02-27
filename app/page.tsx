'use client';

import CardComponent from '@/src/components/card';
import ModalComponent from '@/src/components/modal';
import { SliderComponent } from '@/src/components/slider';
import { useModalStore } from '@/src/stores/modal.store';
import {
  FocusDirection,
  useNavigationStore,
} from '@/src/stores/navigation.store';
import {
  VK_LEFT,
  VK_RIGHT,
  VK_UP,
  VK_DOWN,
  VK_ENTER,
  VK_BACK_SPACE,
} from '@/src/utilities/constants';
import { useEffect } from 'react';

export default function Home() {
  const {
    pressUpEvent,
    pressDownEvent,
    pressBackEvent,
    pressLeft,
    pressRight,
    pressUp,
    pressDown,
    pressEnter,
    pressBack,
    trackFocusPosition,
    moveFocusRow,
  } = useNavigationStore();

  const { isOpen, openModal, closeModal } = useModalStore();

  useEffect(() => {
    pressUpEvent && moveFocusRow(FocusDirection.UP);
  }, [pressUpEvent]);

  useEffect(() => {
    pressDownEvent && moveFocusRow(FocusDirection.DOWN);
  }, [pressDownEvent]);

  useEffect(() => {
    if (pressBackEvent) {
      isOpen ? closeModal() : openModal();
    }
  }, [pressBackEvent]);

  useEffect(() => {
    document.addEventListener(
      'keydown',
      ev => {
        switch (ev.keyCode) {
          case VK_LEFT:
            // Handle mandatory key ←
            pressLeft();
            break;
          case VK_RIGHT:
            // Handle mandatory key →
            pressRight();
            break;
          case VK_UP:
            // Handle mandatory key ↑
            pressUp();
            break;
          case VK_DOWN:
            // Handle mandatory key ↓
            pressDown();
            break;
          case VK_ENTER:
            // Handle mandatory key Confirm / Select / OK
            pressEnter();
            break;
          case VK_BACK_SPACE:
            // Handle mandatory key Back / Return
            pressBack();
            break;
        }
        // Block the browser from handling the keydown event.
        ev.preventDefault();
      },
      false,
    );

    return () => {
      document.removeEventListener('keydown', () => {});
    };
  }, []);

  return (
    <main className="flex flex-col gap-10 py-8">
      <h1 className="px-overscan text-4xl">Jellyfin React</h1>
      <SliderComponent componentFocused={trackFocusPosition('slider-01')}>
        <CardComponent
          isLandscape={true}
          isLarge={true}
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          isLandscape={true}
          isLarge={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          isLandscape={true}
          isLarge={true}
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          isLandscape={true}
          isLarge={true}
          title="Earth"
          image="https://picsum.photos/800/440"
        />
      </SliderComponent>
      <SliderComponent componentFocused={trackFocusPosition('slider-02')}>
        <CardComponent
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          hideTitle={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent title="Earth" image="https://picsum.photos/800/440" />
        <CardComponent
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          hideTitle={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent title="Earth" image="https://picsum.photos/800/440" />
        <CardComponent
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          hideTitle={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent title="Earth" image="https://picsum.photos/800/440" />
        <CardComponent
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          hideTitle={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent title="Earth" image="https://picsum.photos/800/440" />
        <CardComponent
          title="Shadow Hunter"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          hideTitle={true}
          title="Super Puppy"
          image="https://picsum.photos/800/440"
        />
        <CardComponent
          title="Power Sisters"
          image="https://picsum.photos/800/440"
        />
        <CardComponent title="Earth" image="https://picsum.photos/800/440" />
      </SliderComponent>
      {isOpen && <ModalComponent componentFocused={isOpen} />}
    </main>
  );
}
