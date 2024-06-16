import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersLatestItemsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcherList } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function LatestItems(parentIds: string[] | null): {
  data: UsersLatestItemsResponse[] | ErrorResponse[] | undefined;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATHS = parentIds
    ? parentIds.map(
        parentId =>
          `${server}/Users/${userId}/Items/Latest?Limit=16&Fields=PrimaryImageAspectRatio%2CBasicSyncInfo%2CPath&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CThumb&ParentId=${parentId}`,
      )
    : null;

  const { data, isLoading } = useSWR(PATHS, fetcherList);
  return { data, isLoading };
}
