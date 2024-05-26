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
  disabled?: boolean;
  noMinWidth?: boolean;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
}

export default function Button({
  label,
  type,
  loading,
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

  return (
    <button
      ref={ref}
      className={`flex justify-center rounded-3xl py-3 px-5 ${buttonTypeClasses()} ${
        noMinWidth ? '' : 'min-w-[200px]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      outline outline-offset-4 outline-transparent
      ${focused ? 'outline-white' : ''}`}
    >
      {loading ? (
        <Loader
          mode={
            type === ButtonType.Primary ? LoaderStyle.Dark : LoaderStyle.Light
          }
        />
      ) : (
        label
      )}
    </button>
  );
}
