import { ErrorResponse } from '@/@types/api/generic.types';
import { UserDeviceResponse } from '@/@types/api/user.types';
import { DEVICE_ID, SERVER_URL } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function GetDevice(): {
  data: UserDeviceResponse | ErrorResponse[] | undefined;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const deviceId = getCookie(DEVICE_ID);

  const PATHS = `${server}/Devices/Info?id=${deviceId}`;

  const { data, isLoading } = useSWR(PATHS, fetcher);
  return { data, isLoading };
}
