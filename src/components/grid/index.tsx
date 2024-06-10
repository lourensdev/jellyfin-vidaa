'use client';

import React, { useEffect } from 'react';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';

interface GridComponentProps {
  children: React.ReactElement<any>[];
  isFocused?: boolean;
}

export const GridComponent: React.FC<GridComponentProps> = ({
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
      <div
        ref={ref}
        className="flex gap-8 flex-wrap max-w-full ps-overscan pe-overscan"
      >
        {React.Children.map(children, child => {
          return React.cloneElement(child);
        })}
      </div>
    </FocusContext.Provider>
  );
};
