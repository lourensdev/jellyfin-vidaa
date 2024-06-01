import { UsersAuthByNameResponse } from '@/@types/api/user.types';

export async function AuthenticateByName(
  server: string,
  username: string,
  password: string,
  deviceId: string,
) {
  const res = await fetch(server + '/Users/authenticatebyname', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: server,
      'x-emby-authorization': `MediaBrowser Client="Vidaa Jellyfin", Device="Vidaa OS", DeviceId="${deviceId}", Version="1.0"`,
    },
    body: JSON.stringify({
      Username: username,
      Pw: password,
    }),
  });

  if (!res.ok) {
    return {
      error: res.statusText,
    };
  }

  const data = await res.json();
  return data as UsersAuthByNameResponse;
}
