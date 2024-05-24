'use client';

import React, { useEffect } from 'react';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';

interface SliderComponentProps {
  children: React.ReactElement<any>[];
  isFocused?: boolean;
}

export const SliderComponent: React.FC<SliderComponentProps> = ({
  children,
  isFocused,
}) => {
  const { ref, focusKey, focusSelf } = useFocusable();

  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf, isFocused]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex gap-8 overflow-x-hidden max-w-full">
        {React.Children.map(children, child => {
          return React.cloneElement(child);
        })}
      </div>
    </FocusContext.Provider>
  );
};
