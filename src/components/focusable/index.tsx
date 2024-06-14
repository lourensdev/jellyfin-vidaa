'use client';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

export default function HiddenFocusComponent({
  children,
}: {
  children: React.ReactNode;
  focusPosition?: string;
}) {
  const { ref, focused, focusSelf } = useFocusable();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    if (focused) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [ref, focused]);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
