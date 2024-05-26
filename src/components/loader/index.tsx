'use client';

export enum LoaderStyle {
  Light,
  Dark,
}

interface LoaderProps {
  mode: LoaderStyle;
  size?: number;
}

export default function Loader({ mode, size }: LoaderProps) {
  return (
    <div
      className={`loader ${mode === LoaderStyle.Light ? 'light' : 'dark'}`}
      style={size ? { width: `${size}px` } : {}}
    ></div>
  );
}
