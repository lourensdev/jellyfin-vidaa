import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersViewsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID, USER_TOKEN } from '@/src/constants/storage.keys';
import { defaultHeaders, handleError } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';

export async function Views(): Promise<UsersViewsResponse | ErrorResponse> {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);
  const token = getCookie(USER_TOKEN);

  const res = await fetch(`${server}/Users/${userId}/Views`, {
    method: 'GET',
    headers: defaultHeaders(token),
  });

  handleError(res);

  const data = await res.json();
  return data;
}
