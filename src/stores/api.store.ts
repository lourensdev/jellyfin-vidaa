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
};

type ApiState = {
  views: ApiViewsType[] | null;
  setViews: (value: ApiViewsType[]) => void;
  resumeMedia: ApiMediaItemType[] | null;
  setResumeMedia: (value: ApiMediaItemType[]) => void;
  latestShows: ApiMediaItemType[] | null;
  setLatestShows: (value: ApiMediaItemType[]) => void;
  latestMovies: ApiMediaItemType[] | null;
  setLatestMovies: (value: ApiMediaItemType[]) => void;
};

export const useApiStore = create<ApiState>((set, get) => ({
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
}));
