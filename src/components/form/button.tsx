'use client';

import {
  KeyPressDetails,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';
import Loader, { LoaderStyle } from '../loader';

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export interface ButtonProps {
  label: string;
  type: ButtonType;
  loading?: boolean;
  large?: boolean;
  disabled?: boolean;
  noMinWidth?: boolean;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
}

export default function Button({
  label,
  type,
  loading,
  large,
  disabled,
  noMinWidth,
  onEnterPress,
}: ButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress,
  });

  const buttonTypeClasses = (): string => {
    switch (type) {
      case ButtonType.Primary:
        return 'bg-white text-black';
      case ButtonType.Secondary:
        return 'bg-gray text-white';
    }
  };

  const buttonSizeClasses = (): string => {
    if (large) {
      return 'text-2xl py-3 px-12';
    }
    return 'text-lg py-3 px-5';
  };

  return (
    <button
      ref={ref}
      className={`flex justify-center rounded-3xl ${buttonSizeClasses()} ${buttonTypeClasses()} ${
        noMinWidth ? '' : 'min-w-[200px]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ring-transparent ring-offset-[#000b25] ring-offset-4
    ${focused ? 'ring-4 ring-white ring-offset-[#000b25]' : ''}`}
    >
      {loading ? (
        <Loader
          mode={
            type === ButtonType.Primary ? LoaderStyle.Dark : LoaderStyle.Light
          }
          size={large ? 30 : undefined}
        />
      ) : (
        label
      )}
    </button>
  );
}
