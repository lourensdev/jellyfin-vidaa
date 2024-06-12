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

export enum ImageTypes {
  BACKDROP = 'Backdrop',
  PRIMARY = 'Primary',
  LOGO = 'Logo',
}

export const getImagePath = (
  itemId: string | undefined = undefined,
  imageTag: string,
  width: number = 217,
  height: number = 326,
  type: ImageTypes = ImageTypes.PRIMARY,
) => {
  const server = getCookie(SERVER_URL);
  return `${server}/Items/${itemId}/Images/${type}?fillHeight=${height}&fillWidth=${width}&quality=96&tag=${imageTag}`;
};

export const ticksToTime = (ticks?: number | null) => {
  if (!ticks) return null;
  const ticksInSeconds = ticks / 10000000;
  // Format to time 1h 45m
  const hours = Math.floor(ticksInSeconds / 3600);
  const minutes = Math.floor((ticksInSeconds % 3600) / 60);
  return `${hours !== 0 ? hours + 'h' : ''} ${
    minutes !== 0 ? minutes + 'm' : ''
  }`;
};
