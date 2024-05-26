'use client';

import Button, { ButtonType } from '@/src/components/form/button';
import TextInput from '@/src/components/form/input';

export default function LoginPage() {
  return (
    <main className="relative flex flex-col gap-10 py-8 items-center justify-center w-screen h-screen">
      <div className="fixed flex gap-2.5 z-0 w-screen h-screen flex-wrap opacity-20 bg-jellyfin-gradient"></div>
      <div className="px-5 relative z-10 flex flex-col items-center gap-4 w-full max-w-xl">
        <img
          src="assets/banner-dark.svg"
          width={300}
          height={100}
          alt="Jellyfin React"
          loading="lazy"
        />
        <div className="px-5 relative z-10 flex flex-col items-center w-full gap-6 mt-10">
          <TextInput placeholder="Username" />
          <TextInput placeholder="Password" />
          <Button label="Submit" type={ButtonType.Primary} onClick={() => {}} />
        </div>
      </div>
    </main>
  );
}
