import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersLatestItemsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID, USER_TOKEN } from '@/src/constants/storage.keys';
import { defaultHeaders, handleError } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';

export async function LatestItems(
  parentId: string,
): Promise<UsersLatestItemsResponse | ErrorResponse> {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);
  const token = getCookie(USER_TOKEN);

  const res = await fetch(
    `${server}/Users/${userId}/Items/Latest?Limit=16&Fields=PrimaryImageAspectRatio%2CBasicSyncInfo%2CPath&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CThumb&ParentId=${parentId}`,
    {
      method: 'GET',
      headers: defaultHeaders(token),
    },
  );

  handleError(res);

  const data = await res.json();
  return data;
}
