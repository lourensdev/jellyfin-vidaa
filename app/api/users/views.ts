import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersViewsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function Views(): {
  data: UsersViewsResponse | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATH = `${server}/Users/${userId}/Views`;

  const { data, isLoading } = useSWR(PATH, fetcher);
  return { data, isLoading };
}
