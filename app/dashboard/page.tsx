'use client';

import CardComponent from '@/src/components/card';
import ModalComponent from '@/src/components/modal';
import { SliderComponent } from '@/src/components/slider';
import { useModal } from '@/src/hooks/useModal';
import { useModalStore } from '@/src/stores/modal.store';
import { VK_BACK_SPACE } from '@/src/utilities/constants';
import { init } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

init({
  debug: false,
  visualDebug: false,
});

export default function Home() {
  const { isOpen } = useModal();

  return (
    <main className="flex flex-col gap-10 py-8">
      <h1 className="px-overscan text-4xl">Jellyfin React</h1>
      <SliderComponent isFocused={true}>
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
      <SliderComponent>
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
      {isOpen && <ModalComponent />}
    </main>
  );
}
