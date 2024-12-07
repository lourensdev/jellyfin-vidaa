import { ErrorResponse } from '@/@types/api/generic.types';
import { PlaybackMediaInfoResponseType } from '@/@types/api/items.types';
import { UsersResumeItemsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function VideoStream(itemId?: string): {
  data: UsersResumeItemsResponse | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);

  const PATH = `${server}/Videos/${itemId}/stream`;

  const { data, isLoading } = useSWR(itemId ? PATH : null, fetcher);
  return { data, isLoading };
}

export function PlaybackMediaInfo(itemId?: string): {
  data: PlaybackMediaInfoResponseType | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATH = `${server}/Items/${itemId}/PlaybackInfo?userId=${userId}`;

  const { data, isLoading } = useSWR(itemId ? PATH : null, fetcher);
  return { data, isLoading };
}
