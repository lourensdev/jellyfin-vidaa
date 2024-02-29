'use client';

import Button, { ButtonType } from '@/src/components/form/button';
import TextInput from '@/src/components/form/input';

export default function LoginPage() {
  const TOTAL_POSTER = 75;
  const POSTER = Array.from({ length: TOTAL_POSTER }, (_, i) => i + 1);

  return (
    <main className="relative flex flex-col gap-10 py-8 items-center justify-center w-full h-full">
      <div className="fixed flex gap-2.5 z-0 w-screen h-screen flex-wrap opacity-10 blur-sm">
        {POSTER.map(value => (
          <img
            className="aspect-poster w-[calc(10%-10px)] rounded-lg"
            key={value}
            src={`assets/posters/poster-${value}.jpg`}
            alt={`Poster ${value}`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="px-5 relative z-10 flex flex-col items-center gap-4 w-full max-w-xl">
        <img
          src="assets/jellyfin-logo.svg"
          width={160}
          height={160}
          alt="Jellyfin React"
          className="w-40"
          loading="lazy"
        />
        <div className="px-5 relative z-10 flex flex-col items-center w-full gap-6 mt-10">
          <h3 className="text-3xl font-bold text-white">Sign In</h3>
          <TextInput placeholder="Username" />
          <TextInput placeholder="Password" />
          <Button label="Submit" type={ButtonType.Primary} onClick={() => {}} />
        </div>
      </div>
    </main>
  );
}
