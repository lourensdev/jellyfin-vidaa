import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersItemsByTypeResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function ItemsByType(
  typeLabel: string | null,
  parentId: string | null,
): {
  data: UsersItemsByTypeResponse | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATH = `${server}/Users/${userId}/Items?SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=${typeLabel}&Recursive=true&Fields=PrimaryImageAspectRatio%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&StartIndex=0&Limit=100&ParentId=${parentId}`;

  const { data, isLoading } = useSWR(
    typeLabel && parentId ? PATH : null,
    fetcher,
  );
  return { data, isLoading };
}
