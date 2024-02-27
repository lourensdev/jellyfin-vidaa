'use client';

import { useEffect, useRef } from 'react';

export interface CardComponentProps {
  title: string;
  image: string;
  isActive?: boolean;
  isFocused?: boolean;
  isLandscape?: boolean;
  isLarge?: boolean;
  hideTitle?: boolean;
}

export default function CardComponent(props: CardComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  // Scroll into view when the card is active
  useEffect(() => {
    if (!props.isActive) return;
    elementRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [props.isActive]);

  const getWrapperClassNames = (): string => {
    let classNames =
      'relative flex flex-col justify-end ring-4 ring-transparent transition-shadow box-border';
    classNames += props.isActive && props.isFocused ? ' ring-white' : '';
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
    let classNames = 'py-4 text-center opacity-0 transition-opacity';
    classNames += props.isActive && props.isFocused ? ' opacity-100' : '';
    return classNames;
  };

  const getTitleClassNames = (): string => {
    let classNames =
      'absolute p-8 left-0 top-0 right-0 bottom-0 flex flex-col justify-end radial-gradient';
    classNames += props.isLarge ? ' rounded-xl' : ' rounded';
    return classNames;
  };

  return (
    <div ref={elementRef} className="first:ps-overscan last:pe-overscan p-1">
      <div className={getWrapperClassNames()}>
        <div className={getTitleClassNames()}>
          {props.isLarge && !props.hideTitle && (
            <h5 className="text-4xl">{props.title}</h5>
          )}
        </div>
        <img
          src={props.image}
          alt={props.title}
          className={getImageClassNames()}
        />
      </div>
      {!props.isLarge && !props.hideTitle && (
        <div className={getDefaultTitleClassNames()}>
          <h5 className="text-lg">{props.title}</h5>
        </div>
      )}
    </div>
  );
}
