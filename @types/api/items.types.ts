import { components } from './source/jellyfin-api-schema';

export type ItemType = components['schemas']['BaseItemDto']['Type'];

export type PlaybackMediaInfoResponseType =
  components['schemas']['PlaybackInfoResponse'];

export type MediaSourcesType = PlaybackMediaInfoResponseType['MediaSources'];

export type MediaSourceInfo = components['schemas']['MediaSourceInfo'];
