import { UserItemsByIdResponse } from '@/@types/api/user.types';
import { CollectionType } from '@/@types/collections.types';
import { create } from 'zustand';

export type ApiViewsType = {
  label: string;
  id: string;
  type: CollectionType;
};

export type ApiMediaItemType = {
  label: string;
  id: string;
  year: number | null;
  image: string;
  progress?: number;
  isFavourite?: boolean;
  unplayedCount?: number;
};

type ApiState = {
  activeView: CollectionType | null;
  setActiveView: (value: CollectionType) => void;
  views: ApiViewsType[] | null;
  setViews: (value: ApiViewsType[]) => void;
  resumeMedia: ApiMediaItemType[] | null;
  setResumeMedia: (value: ApiMediaItemType[]) => void;
  latestShows: ApiMediaItemType[] | null;
  setLatestShows: (value: ApiMediaItemType[]) => void;
  latestMovies: ApiMediaItemType[] | null;
  setLatestMovies: (value: ApiMediaItemType[]) => void;
  allMediaByType: ApiMediaItemType[] | null;
  setAllMediaByType: (value: ApiMediaItemType[]) => void;
};

export const useApiStore = create<ApiState>((set, get) => ({
  activeView: null,
  setActiveView: (value: CollectionType) => {
    set({ activeView: value });
  },
  views: null,
  setViews: (value: ApiViewsType[]) => {
    set({ views: value });
  },
  resumeMedia: null,
  setResumeMedia: (value: ApiMediaItemType[]) => {
    set({ resumeMedia: value });
  },
  latestShows: null,
  setLatestShows: (value: ApiMediaItemType[]) => {
    set({ latestShows: value });
  },
  latestMovies: null,
  setLatestMovies: (value: ApiMediaItemType[]) => {
    set({ latestMovies: value });
  },
  allMediaByType: null,
  setAllMediaByType: (value: ApiMediaItemType[]) => {
    set({ allMediaByType: value });
  },
}));
