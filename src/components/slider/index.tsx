'use client';

import { useEffect, useState } from 'react';
import { CardComponentProps } from '../card';
import { useNavigationStore } from '../../stores/navigation.store';
import React from 'react';

interface SliderComponentProps {
  children: React.ReactElement<CardComponentProps>[];
  componentFocused: boolean;
}

export const SliderComponent: React.FC<SliderComponentProps> = ({
  children,
  componentFocused,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const { isOnExitModal, pressLeftEvent, pressRightEvent } =
    useNavigationStore();

  useEffect(() => {
    const navigateLeft = () => {
      if (activeCardIndex > 0 && componentFocused && !isOnExitModal) {
        setActiveCardIndex(activeCardIndex - 1);
      }
    };
    pressLeftEvent && navigateLeft();
  }, [pressLeftEvent, componentFocused, isOnExitModal]);

  useEffect(() => {
    const navigateRight = () => {
      if (
        activeCardIndex < children.length - 1 &&
        componentFocused &&
        !isOnExitModal
      ) {
        setActiveCardIndex(activeCardIndex + 1);
      }
    };
    pressRightEvent && navigateRight();
  }, [pressRightEvent, componentFocused, isOnExitModal]);

  return (
    <div className="flex gap-8 overflow-x-hidden max-w-full">
      {React.Children.map(children, (child, index) => {
        const isActive = index === activeCardIndex && componentFocused;
        return React.cloneElement(child, {
          isActive,
          isFocused: componentFocused,
        });
      })}
    </div>
  );
};
