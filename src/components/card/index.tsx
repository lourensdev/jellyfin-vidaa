'use client';

import { useNavbar } from '@/src/hooks/useNavbar';
import { useFocusStore } from '@/src/stores/focus.store';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

export interface CardComponentProps {
  title: string;
  image: string;
  year?: number | null;
  isFocused?: boolean;
  isLandscape?: boolean;
  isLarge?: boolean;
  hideTitle?: boolean;
  hideGradientOverlay?: boolean;
  progress?: number;
}

export default function CardComponent(props: CardComponentProps) {
  const { ref, focused, focusKey } = useFocusable();
  const { closeNavbar } = useNavbar();
  const { setLastFocused } = useFocusStore();

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
      'relative flex flex-col justify-end ring-4 ring-transparent transition-shadow box-border';
    classNames += focused ? ' ring-white' : '';
    classNames += !props.isLandscape ? ' aspect-[1/1.5]' : ' aspect-[16/9]';
    classNames += !props.isLarge
      ? ' w-[15rem] rounded'
      : ' w-[42rem] rounded-xl';
    return classNames;
  };

  const getImageClassNames = (): string => {
    let classNames = 'block object-cover w-full h-full';
    classNames += !props.isLarge ? ' rounded' : ' rounded-xl';
    return classNames;
  };

  const getDefaultTitleClassNames = (): string => {
    let classNames = 'pt-4 text-center opacity-0 transition-opacity';
    classNames += focused ? ' opacity-100' : '';
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
    <div ref={ref} className="first:ps-overscan last:pe-overscan p-1">
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
        <img
          src={props.image}
          alt={props.title}
          className={getImageClassNames()}
        />
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
      {!props.isLarge && !props.hideTitle && (
        <div className={getDefaultTitleClassNames()}>
          <h5 className="text-lg">
            {props.title}
            {props.year && (
              <span className="text-md opacity-50 inline-block pl-2">
                ({props.year})
              </span>
            )}
          </h5>
        </div>
      )}
    </div>
  );
}
