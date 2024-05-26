'use client';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

export interface TextInputProps {
  placeholder: string;
  type?: string;
  value?: string;
  large?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function TextInput({
  placeholder,
  type,
  value,
  large,
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

  const inputSizeClasses = (): string => {
    if (large) {
      return 'text-2xl py-3 px-6';
    }
    return 'py-2 px-4';
  };

  return (
    <input
      ref={ref}
      className={`bg-gray text-white rounded-lg ${inputSizeClasses()} w-full outline-none border-4 border-transparent focus:border-white ${
        focused ? 'border-white' : ''
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      type={type || 'text'}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onKeyUp={e => {
        onChange?.(e.currentTarget.value);
      }}
    />
  );
}
