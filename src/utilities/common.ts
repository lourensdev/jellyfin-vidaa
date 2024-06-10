import { getCookie } from 'cookies-next';
import { DEVICE_ID, SERVER_URL } from '../constants/storage.keys';

export const defaultHeaders = (token?: string) => {
  const deviceId = getCookie(DEVICE_ID);
  return {
    'Content-Type': 'application/json',
    'x-emby-authorization': `MediaBrowser Client="Vidaa Jellyfin", Device="Vidaa OS", DeviceId="${deviceId}", Version="1.0" ${
      token ? `, Token="${token}"` : ''
    }`,
  };
};

export const handleError = (res: any) => {
  if (!res.ok) {
    return {
      error: res.statusText,
    };
  }
};

export const getImagePath = (
  itemId: string | undefined = undefined,
  imageTag: string,
  width: number = 217,
  height: number = 326,
  isBackdrop: boolean = false,
) => {
  const server = getCookie(SERVER_URL);
  return `${server}/Items/${itemId}/Images/${
    isBackdrop ? 'Backdrop' : 'Primary'
  }?fillHeight=${height}&fillWidth=${width}&quality=96&tag=${imageTag}`;
};
