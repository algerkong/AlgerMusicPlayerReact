import type { SongResult } from '@/types/music';

export type PlayMode = 'sequence' | 'loop' | 'random';

export interface MusicStore {
  // 状态
  menus: any[];
  play: boolean;
  isPlay: boolean;
  playMusic: SongResult | null;
  playMusicUrl: string | null;
  user: any;
  playList: SongResult[];
  playListIndex: number;
  storedData: any;
  lyric: any;
  isMobile: boolean;
  searchValue: string;
  searchType: number;
  playMode: PlayMode;
  favorites: SongResult[];

  // 操作方法
  setMenus: (menus: any[]) => void;
  setPlayMusic: (music: SongResult | null) => void;
  setPlayMusicUrl: (url: string | null) => void;
  setPlay: (play: boolean) => void;
  setIsPlay: (isPlay: boolean) => void;
  setPlayList: (list: SongResult[]) => void;
  setPlayListIndex: (index: number) => void;
  setData: (data: any) => void;
  updateLyrics: (lyrics: any) => void;
  setPlayMode: (mode: 'sequence' | 'loop' | 'random') => void;
  toggleFavorite: (song: SongResult) => void;
}

export type State = Omit<MusicStore, keyof Actions>;
export type Actions = {
  setMenus: (menus: any[]) => void;
  setPlayMusic: (music: SongResult | null) => void;
  setPlayMusicUrl: (url: string | null) => void;
  setPlay: (play: boolean) => void;
  setIsPlay: (isPlay: boolean) => void;
  setPlayList: (list: SongResult[]) => void;
  setPlayListIndex: (index: number) => void;
  setData: (data: any) => void;
  updateLyrics: (lyrics: any) => void;
  setPlayMode: (mode: 'sequence' | 'loop' | 'random') => void;
  toggleFavorite: (song: SongResult) => void;
}; 