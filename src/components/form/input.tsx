'use client';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

export interface TextInputProps {
  placeholder: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function TextInput({
  placeholder,
  value,
  disabled,
  onChange,
}: TextInputProps) {
  const { ref, focused } = useFocusable();

  useEffect(() => {
    if (focused) {
      ref.current.focus();
    } else {
      ref.current.blur();
    }
  }, [focused]);

  return (
    <input
      ref={ref}
      className={`bg-gray text-white rounded-lg py-2 px-4 w-full outline-none border-4 border-transparent focus:border-white ${
        focused ? 'border-white' : ''
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onKeyUp={e => {
        onChange?.(e.currentTarget.value);
      }}
    />
  );
}
