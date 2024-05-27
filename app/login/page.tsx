'use client';

import Button, { ButtonType } from '@/src/components/form/button';
import TextInput from '@/src/components/form/input';
import ModalComponent from '@/src/components/modal';
import { useModal } from '@/src/hooks/useModal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

init({
  debug: false,
  visualDebug: false,
});

export default function LoginPage() {
  const { isOpen } = useModal();
  const router = useRouter();
  const { ref, focusKey, focusSelf } = useFocusable();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    !isOpen && focusSelf();
  }, [isOpen, focusSelf]);

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="relative flex flex-col gap-10 py-8 items-center justify-center w-screen h-screen">
        <div className="fixed flex gap-2.5 z-0 w-screen h-screen flex-wrap opacity-20 bg-jellyfin-gradient"></div>
        <div className="px-5 relative z-10 flex flex-col items-center gap-4 w-full max-w-2xl">
          <img
            src="assets/banner-dark.svg"
            width={300}
            height={100}
            alt="Jellyfin React"
            loading="lazy"
          />
          <div
            className="px-5 relative z-10 flex flex-col items-center w-full gap-6 mt-8"
            ref={ref}
          >
            <TextInput
              placeholder="Username"
              large={true}
              onChange={e => setUsername(e)}
              disabled={submitting}
            />
            <TextInput
              placeholder="Password"
              large={true}
              type={'password'}
              onChange={e => setPassword(e)}
              disabled={submitting}
            />
            <Button
              label="Connect"
              type={ButtonType.Primary}
              large={true}
              onEnterPress={submit}
              loading={submitting}
              disabled={submitting}
            />
          </div>
        </div>
        {isOpen && <ModalComponent />}
      </main>
    </FocusContext.Provider>
  );
}
