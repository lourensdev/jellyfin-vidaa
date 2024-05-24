'use client';

import {
  KeyPressDetails,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';

interface ButtonProps {
  label: string;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
}

export default function Button({ label, onEnterPress }: ButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress,
  });

  return (
    <button
      ref={ref}
      className={
        `appearance-none rounded-lg p-4 min-w-40 ` +
        (focused ? 'text-white bg-neutral-950' : 'bg-neutral-200')
      }
    >
      {label}
    </button>
  );
}
