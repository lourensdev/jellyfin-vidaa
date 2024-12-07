import type { paths } from './source/jellyfin-api-schema';

export type UsersAuthByNameBody =
  paths['/Users/AuthenticateByName']['post']['requestBody']['content']['application/json'];

export type UsersAuthByNameResponse =
  paths['/Users/AuthenticateByName']['post']['responses']['200']['content']['application/json'];

export type UsersViewsResponse =
  paths['/UserViews']['get']['responses']['200']['content']['application/json'];

export type UsersResumeItemsResponse =
  paths['/UserItems/Resume']['get']['responses']['200']['content']['application/json'];

export type UsersLatestItemsResponse =
  paths['/Items/Latest']['get']['responses']['200']['content']['application/json'];

export type UsersItemsByTypeResponse =
  paths['/Items']['get']['responses']['200']['content']['application/json'];

export type UserItemsByIdResponse =
  paths['/Items/{itemId}']['get']['responses']['200']['content']['application/json'];

export type UserDeviceResponse =
  paths['/Devices/Info']['get']['responses']['200']['content']['application/json'];
