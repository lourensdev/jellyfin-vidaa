'use client';

import React, { useEffect } from 'react';
import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';

interface NavBarProps {
  children: React.ReactElement<any>[];
}

export const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const { ref, focusKey, focusSelf, focused } = useFocusable();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={`p-8 pr-16 flex flex-col gap-4 min-h-full ${
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
