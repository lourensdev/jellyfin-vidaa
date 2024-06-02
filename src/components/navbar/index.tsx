'use client';

import React, { useEffect } from 'react';
import {
  FocusContext,
  setFocus,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useFocusStore } from '@/src/stores/focus.store';

interface NavBarProps {
  children: React.ReactElement<any>[];
}

export const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const { lastFocused, setLastFocused } = useFocusStore();
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    onBlur: () => {
      if (lastFocused) {
        setTimeout(() => {
          setFocus(lastFocused);
          setLastFocused(null);
        }, 50);
      }
    },
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={`p-8 pr-16 flex flex-col gap-4 ${
          focused ? 'max-w-0' : 'max-w-md'
        }`}
      >
        <img
          src="assets/banner-dark.svg"
          width={150}
          height={50}
          alt="Jellyfin React"
          loading="lazy"
          className="mb-8"
        />
        {React.Children.map(children, child => {
          return React.cloneElement(child);
        })}
      </div>
    </FocusContext.Provider>
  );
};
