'use client';

import React, { useEffect } from 'react';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';

interface SliderComponentProps {
  children: React.ReactElement<any>[];
  className?: string;
  isFocused?: boolean;
}

export const SliderComponent: React.FC<SliderComponentProps> = ({
  children,
  className,
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
      <div
        ref={ref}
        className={`flex gap-8 overflow-x-scroll invisible-scrollbar max-w-full ${className}`}
      >
        {React.Children.map(children, child => {
          return React.cloneElement(child);
        })}
      </div>
    </FocusContext.Provider>
  );
};
