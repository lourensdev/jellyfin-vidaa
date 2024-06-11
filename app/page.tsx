'use client';

import { USER_DATA } from '@/src/constants/storage.keys';
import { Storage } from '@/src/utilities/storage';
import { animated, useSpring, easings } from '@react-spring/web';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
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
      const userData = Storage.get(USER_DATA);
      if (userData) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
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
      </div>
    </div>
  );
}
