import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersAuthByNameResponse } from '@/@types/api/user.types';
import { SERVER_URL } from '@/src/constants/storage.keys';
import { defaultHeaders, handleError } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';

export async function AuthenticateByName(
  username: string,
  password: string,
): Promise<UsersAuthByNameResponse | ErrorResponse> {
  const server = getCookie(SERVER_URL);
  const res = await fetch(`${server}/Users/authenticatebyname`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({
      Username: username,
      Pw: password,
    }),
  });

  handleError(res);

  const data = await res.json();
  return data;
}
