'use client';

import { v4 as uuidv4 } from 'uuid';
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
import { AuthenticateByName } from '../api/users/authenticateByName';
import { Storage } from '@/src/utilities/storage';
import { DEVICE_ID, USER_DATA } from '@/src/constants/storage.keys';

init({
  debug: false,
  visualDebug: false,
});

export default function LoginPage() {
  const { isOpen } = useModal();
  const router = useRouter();
  const { ref, focusKey, focusSelf } = useFocusable();

  const [server, setServer] = useState<string>('http://192.168.1.180:8096');
  const [username, setUsername] = useState<string>('lpdev');
  const [password, setPassword] = useState<string>('1234');
  const [deviceId, setDeviceId] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const deviceId = Storage.get(DEVICE_ID);
    if (!deviceId) {
      const id = uuidv4();
      setDeviceId(id);
      Storage.set(DEVICE_ID, id);
    } else {
      setDeviceId(deviceId);
    }
  }, []);

  useEffect(() => {
    !isOpen && focusSelf();
  }, [isOpen, focusSelf]);

  const submit = async () => {
    setSubmitting(true);
    const data = await AuthenticateByName(server, username, password, deviceId);

    if ('error' in data && data.error) {
      setSubmitting(false);
      return;
    } else {
      Storage.set(USER_DATA, data);
      router.push('/dashboard');
    }
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
              placeholder="Server e.g http://192.168.1.10:8096"
              large={true}
              value={server}
              onChange={e => setServer(e)}
              disabled={submitting}
            />
            <TextInput
              placeholder="Username"
              large={true}
              value={username}
              onChange={e => setUsername(e)}
              disabled={submitting}
            />
            <TextInput
              placeholder="Password"
              large={true}
              value={password}
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
