import { ErrorResponse } from '@/@types/api/generic.types';
import { UsersResumeItemsResponse } from '@/@types/api/user.types';
import { SERVER_URL, USER_ID } from '@/src/constants/storage.keys';
import { fetcher } from '@/src/utilities/common';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

export function ResumeItems(): {
  data: UsersResumeItemsResponse | ErrorResponse;
  isLoading: boolean;
} {
  const server = getCookie(SERVER_URL);
  const userId = getCookie(USER_ID);

  const PATH = `${server}/Users/${userId}/Items/Resume?Limit=12&Recursive=true&Fields=PrimaryImageAspectRatio%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CThumb&EnableTotalRecordCount=false&MediaTypes=Video`;

  const { data, isLoading } = useSWR(PATH, fetcher);
  return { data, isLoading };
}
