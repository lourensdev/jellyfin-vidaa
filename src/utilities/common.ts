import { getCookie } from 'cookies-next';
import { DEVICE_ID, SERVER_URL, USER_TOKEN } from '../constants/storage.keys';

export const fetcher = async (url: string) => {
  const token = getCookie(USER_TOKEN);
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders(token),
  });

  handleError(res);

  const data = await res.json();
  return data;
};

export const fetcherList = async (urls: string[]) => {
  const results = await Promise.all(
    urls.map(async url => {
      const token = getCookie(USER_TOKEN);
      const res = await fetch(url, {
        method: 'GET',
        headers: defaultHeaders(token),
      });

      handleError(res);

      const data = await res.json();
      return data;
    }),
  );
  return results;
};

export const defaultHeaders = (token?: string) => {
  const deviceId = getCookie(DEVICE_ID);
  return {
    'Content-Type': 'application/json',
    'x-emby-authorization': `MediaBrowser Client="Vidaa Jellyfin", Device="Vidaa OS", DeviceId="${deviceId}", Version="1.0" ${
      token ? `, Token="${token}"` : ''
    }`,
  };
};

export const handleError = async (res: any) => {
  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
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

/**
 * Takes in seconds and returns a formatted time string e.g "00:00:00"
 *
 * @param {number} seconds
 */
export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
