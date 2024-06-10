import Loader, { LoaderStyle } from '../loader';

interface PageLoaderProps {
  mode: LoaderStyle;
  size?: number;
  height?: number;
}

export default function PageLoader({ mode, size, height }: PageLoaderProps) {
  return (
    <div
      className={`flex justify-center items-center w-full ${
        height ? '' : 'min-h-screen'
      }`}
      style={{ height }}
    >
      <Loader mode={mode} size={size} />
    </div>
  );
}
