'use client';

export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export interface ButtonProps {
  label: string;
  type: ButtonType;
  disabled?: boolean;
  noMinWidth?: boolean;
  onClick: () => void;
}

export default function Button({
  label,
  type,
  disabled,
  noMinWidth,
  onClick,
}: ButtonProps) {
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
      className={`rounded-3xl py-3 px-5 ${buttonTypeClasses()} ${
        noMinWidth ? '' : 'min-w-[200px]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
