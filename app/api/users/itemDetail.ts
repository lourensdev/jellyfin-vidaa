import { ErrorResponse } from '@/@types/api/generic.types';
import { UserItemsByIdResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function ItemDetail(itemId: string): {
  data: UserItemsByIdResponse | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATH = `${server}/Users/${userId}/Items/${itemId}`;

  const { data, isLoading } = useSWR(PATH, fetcher);
  return { data, isLoading };
}
