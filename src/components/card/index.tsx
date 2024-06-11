'use client';

import { useNavbar } from '@/src/hooks/useNavbar';
import { useFocusStore } from '@/src/stores/focus.store';
import { Movie } from '@material-ui/icons';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface CardComponentProps {
  title: string;
  image: string;
  year?: number | null;
  width: number;
  height: number;
  isFocused?: boolean;
  isLandscape?: boolean;
  isLarge?: boolean;
  hideTitle?: boolean;
  showTitleAlways?: boolean;
  hideGradientOverlay?: boolean;
  progress?: number;
  isGridCard?: boolean;
  path?: string;
  unplayedCount?: number;
  isFavourite?: boolean;
}

export default function CardComponent(props: CardComponentProps) {
  const router = useRouter();
  const { ref, focused, focusKey } = useFocusable({
    onEnterPress: () => props.path && router.push(props.path),
  });
  const { closeNavbar } = useNavbar();
  const { setLastFocused } = useFocusStore();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (focused) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      closeNavbar();

      // Store a reference to the last focused element
      setTimeout(() => {
        setLastFocused(focusKey);
      }, 500);
    }
  }, [ref, focused]);

  const getWrapperClassNames = (): string => {
    let classNames =
      'relative flex flex-col justify-end ring-4 ring-transparent transition-shadow box-border bg-white/10';
    classNames += focused ? ' ring-white' : '';
    classNames += !props.isLandscape ? ' aspect-[1/1.5]' : ' aspect-[16/9]';
    classNames += !props.isLarge ? ' rounded' : ' w-[42rem] rounded-xl';
    classNames +=
      props.isLandscape && !props.isLarge ? ' w-[23rem]' : ' w-[15rem]';
    return classNames;
  };

  const getImageClassNames = (): string => {
    let classNames = 'block object-cover w-full h-full';
    classNames += !props.isLarge ? ' rounded' : ' rounded-xl';
    return classNames;
  };

  const getDefaultTitleClassNames = (): string => {
    let classNames = 'pt-4 text-center opacity-0 transition-opacity';
    classNames += focused || props.showTitleAlways ? ' opacity-100' : '';
    return classNames;
  };

  const getTitleClassNames = (): string => {
    let classNames = `absolute p-8 left-0 top-0 right-0 bottom-0 flex flex-col justify-end ${
      props.hideGradientOverlay ? '' : 'bg-radial-gradient'
    }`;
    classNames += props.isLarge ? ' rounded-xl' : ' rounded';
    return classNames;
  };

  return (
    <div
      ref={ref}
      className={`${
        props.isGridCard
          ? ''
          : 'first:ps-overscan last:pe-overscan p-1 box-content'
      }`}
      style={{
        width: props.width + 'px',
      }}
    >
      <div className={getWrapperClassNames()}>
        <div className={getTitleClassNames()}>
          {props.isLarge && !props.hideTitle && (
            <h5 className="text-4xl">
              {props.title}
              {props.year && (
                <span className="text-3xl opacity-50 inline-block pl-2">
                  {props.year}
                </span>
              )}
            </h5>
          )}
        </div>
        {!imageError ? (
          <Image
            src={props.image}
            alt={props.title}
            width={props.width}
            height={props.height}
            style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
            onLoad={e => e.currentTarget.style.setProperty('opacity', '1')}
            onError={() => setImageError(true)}
            loading="lazy"
            className={getImageClassNames()}
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full rounded bg-white/10 text-white text-2xl">
            <Movie fontSize={'large'} />
          </div>
        )}
      </div>
      {props.progress && (
        <div className="mt-4 h-2 rounded overflow-hidden w-full bg-black opacity-75">
          <div
            className="h-full rounded"
            style={{
              backgroundColor: '#37A2DB',
              width: `${props.progress}%`,
            }}
          ></div>
        </div>
      )}
      {((!props.isLarge && !props.hideTitle) || props.showTitleAlways) && (
        <div className={getDefaultTitleClassNames()}>
          <h5 className="text-lg">
            {props.title}
            {props.year && (
              <span className="text-md opacity-50 inline-block pl-2">
                ({props.year})
              </span>
            )}
            {props.unplayedCount && (
              <span className="w-7 flex-inline px-2 py-1 ml-2 justify-center items-center text-sm bg-[--jellyfin-gradient-end] rounded">
                {props.unplayedCount}
              </span>
            )}
          </h5>
        </div>
      )}
    </div>
  );
}
