'use client';

import Loader, { LoaderStyle } from '@/src/components/loader';
import { animated, useSpring, easings } from '@react-spring/web';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SplashPage() {
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const router = useRouter();

  const springs = useSpring({
    from: {
      opacity: 0,
      scale: 2,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
    onResolve: () => {
      setTimeout(() => {
        setShowSpinner(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }, 500);
    },
    config: {
      duration: 1500,
      easing: easings.easeOutQuint,
    },
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="relative">
        <animated.img
          src="assets/banner-dark.svg"
          width={500}
          height={200}
          alt="Jellyfin React"
          top-full
          style={{
            ...springs,
          }}
        />
        {showSpinner && (
          <div className="absolute top-full right-2/4 translate-x-2/4">
            <Loader mode={LoaderStyle.Light} size={40} />
          </div>
        )}
      </div>
    </div>
  );
}
