import { components } from './source/jellyfin-api-schema';

export type ErrorResponse = {
  error: string;
};

export type Person = components['schemas']['BaseItemPerson']['Type'];
