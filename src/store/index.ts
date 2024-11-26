import { create } from 'zustand';
import type { MusicStore, State, PlayMode } from '@/types/store';
import type { SongResult } from '@/types/music';
import homeRouter from '@/router/home';

const useStore = create<MusicStore>((set) => ({
  // 初始状态
  menus: homeRouter,
  play: false,
  isPlay: false,
  playMusic: null,
  playMusicUrl: null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  playList: [],
  playListIndex: 0,
  storedData: null,
  lyric: {},
  isMobile: false,
  searchValue: '',
  searchType: 1,
  playMode: localStorage.getItem('playMode') as PlayMode || 'sequence',
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),

  // 操作方法
  setMenus: (menus: any[]) => set({ menus }),
  setPlayMusic: (music: SongResult | null) => set({ playMusic: music }),
  setPlayMusicUrl: (url: string | null) => set({ playMusicUrl: url }),
  setPlay: (play: boolean) => set({ play }),
  setIsPlay: (isPlay: boolean) => set({ isPlay }),
  setPlayList: (list: SongResult[]) => set((state: State) => ({
    playList: list,
    playListIndex: state.playMusic?.id 
      ? list.findIndex((item: SongResult) => item.id === state.playMusic?.id)
      : 0
  })),
  setPlayListIndex: (index: number) => set({ playListIndex: index }),
  setPlayMode: (mode: PlayMode) => {
    localStorage.setItem('playMode', mode);
    set({ playMode: mode });
  },
  toggleFavorite: (song: SongResult) => set((state: State) => {
    const exists = state.favorites.some(item => item.id === song.id);
    const newFavorites = exists
      ? state.favorites.filter(item => item.id !== song.id)
      : [...state.favorites, song];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),
  setData: (data: any) => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.setStoreValue('set', JSON.stringify(data));
    }
    set({ storedData: data });
  },
  updateLyrics: (lyrics: any) => set((state: State) => ({
    playMusic: state.playMusic 
      ? { ...state.playMusic, lyric: lyrics }
      : null
  })),
}));

export { useStore };
export default useStore; 