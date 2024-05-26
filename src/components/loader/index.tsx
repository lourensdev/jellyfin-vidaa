'use client';

export enum LoaderStyle {
  Light,
  Dark,
}

interface LoaderProps {
  mode: LoaderStyle;
}

export default function Loader({ mode }: LoaderProps) {
  return (
    <div
      className={`loader ${mode === LoaderStyle.Light ? 'light' : 'dark'}`}
    ></div>
  );
}
