'use client';

import {
  FocusContext,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

export default function HiddenFocusComponent({
  children,
  className,
  focusPositionBlock,
  focusPositionInline,
  noScroll = false,
}: {
  children: React.ReactNode;
  className?: string;
  focusPositionBlock?: string;
  focusPositionInline?: string;
  noScroll?: boolean;
}) {
  const { ref, focused, focusKey, focusSelf } = useFocusable();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    if (focused && noScroll !== true) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: focusPositionBlock || 'center',
        inline: focusPositionInline || 'center',
      });
    }
  }, [ref, focused]);

  return (
    <FocusContext.Provider value={focusKey}>
      <span ref={ref} className={className || 'inline-block'}>
        {children}
      </span>
    </FocusContext.Provider>
  );
}
