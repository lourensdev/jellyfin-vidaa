'use client';

import { useNavbar } from '@/src/hooks/useNavbar';
import { useFocusStore } from '@/src/stores/focus.store';
import { Person } from '@material-ui/icons';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect, useState } from 'react';
import { Person as PersonType } from '@/@types/api/generic.types';

export interface PersonCardComponentProps {
  name: string;
  image: string;
  role?: string | null;
  type?: PersonType | null;
  width: number;
  height: number;
  isFocused?: boolean;
}

export default function PersonCardComponent(props: PersonCardComponentProps) {
  const { ref, focused, focusKey } = useFocusable();
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
    classNames += ' aspect-[1/1.5]';
    classNames += ' rounded';
    classNames += ' w-[150px]';
    return classNames;
  };

  return (
    <div
      ref={ref}
      className="p-1 box-content"
      style={{
        width: props.width + 'px',
      }}
    >
      <div className={getWrapperClassNames()}>
        {!imageError ? (
          <img
            src={props.image}
            alt={props.name}
            width={props.width}
            height={props.height}
            style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
            onLoad={e => e.currentTarget.style.setProperty('opacity', '1')}
            onError={() => setImageError(true)}
            loading="lazy"
            className="block object-cover w-full h-full rounded"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full rounded bg-white/10 text-white text-2xl">
            <Person fontSize={'large'} />
          </div>
        )}
      </div>
      <div className="pt-4 text-center transition-opacity">
        <h5 className="text-md">
          {props.name}<br />
          {props.role && (
            <div className="text-md opacity-50 inline-block pl-2">
              {props.type === 'Actor' || props.type === 'GuestStar' && 'as '} {props.role}
            </div>
          )}
        </h5>
      </div>
    </div>
  );
}
