import type { paths } from './source/jellyfin-api-schema';

export type UsersAuthByNameBody =
  paths['/Users/AuthenticateByName']['post']['requestBody']['content']['application/json'];

export type UsersAuthByNameResponse =
  paths['/Users/AuthenticateByName']['post']['responses']['200']['content']['application/json'];
