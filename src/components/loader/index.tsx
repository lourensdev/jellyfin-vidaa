'use client';

export enum LoaderStyle {
  Light,
  Dark,
  Blue,
}

interface LoaderProps {
  mode: LoaderStyle;
  size?: number;
}

export default function Loader({ mode, size }: LoaderProps) {
  const getStyleClass = (mode: LoaderStyle): string => {
    switch (mode) {
      case LoaderStyle.Light:
        return 'light';
      case LoaderStyle.Dark:
        return 'dark';
      case LoaderStyle.Blue:
        return 'blue';
    }
  };

  return (
    <div
      className={`loader ${getStyleClass(mode)}`}
      style={size ? { width: `${size}px` } : {}}
    ></div>
  );
}
