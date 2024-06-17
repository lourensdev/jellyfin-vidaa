'use client';

import Button, { ButtonType } from '@/src/components/form/button';
import ModalComponent from '@/src/components/modal';
import { useModal } from '@/src/hooks/useModal';
import {
  FocusContext,
  init,
  useFocusable,
} from '@noriginmedia/norigin-spatial-navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CloudOff } from '@material-ui/icons';

init({
  debug: false,
  visualDebug: false,
});

export default function ServerErrorPage() {
  const router = useRouter();
  const { ref, focusKey, focusSelf } = useFocusable();
  const { isModalOpen } = useModal();

  useEffect(() => {
    focusSelf();
  }, [focusKey]);

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="relative flex flex-col gap-10 py-8 items-center justify-center w-screen h-screen">
        <div className="px-5 relative z-10 flex flex-col items-center gap-4 w-full max-w-2xl">
          <div
            className="px-5 relative z-10 flex flex-col items-center w-full gap-6"
            ref={ref}
          >
            <CloudOff
              fontSize="large"
              style={{ width: '100px', height: '100px' }}
            />
            <div className="text-3xl font-bold text-center">
              Unable to connect to server
            </div>{' '}
            <div className="text-2xl text-center pb-8">
              Make sure it's online and try to reconnect. Alternatively login to
              another server.
            </div>
            <div className="flex gap-8">
              <Button
                label="Reconnect"
                type={ButtonType.Primary}
                large={true}
                onEnterPress={() => router.push('/')}
              />
              <Button
                label="Login"
                type={ButtonType.Secondary}
                large={true}
                onEnterPress={() => router.push('/login')}
              />
            </div>
          </div>
        </div>
        {isModalOpen && <ModalComponent />}
      </main>
    </FocusContext.Provider>
  );
}
