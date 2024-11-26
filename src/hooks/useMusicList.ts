import { useCallback } from 'react';
import { getMusicLrc, getMusicUrl, getParsingMusicUrl } from '@/api/music';
import { useMusicHistory } from '@/hooks/useMusicHistory';
import useStore from '@/store';
import type { ILyricText, SongResult, IParsedLyric } from '@/types/music';
import { getImgUrl, getMusicProxyUrl } from '@/utils';
import { getImageLinearBackground } from '@/utils/linearColor';

export const useMusicList = () => {
  const { addMusic } = useMusicHistory();
  const store = useStore();

  const getSongUrl = useCallback(async (id: number) => {
    const { data } = await getMusicUrl(id);
    console.log('data',data)
    let url = '';
    try {
      if (data.data[0].freeTrialInfo || !data.data[0].url) {
        const res = await getParsingMusicUrl(id);
        url = res.data.data.url;
      }
    } catch (error) {
      console.error('error', error);
    }
    url = url || data.data[0].url;
    return getMusicProxyUrl(url);
  }, []);

  const getSongDetail = useCallback(async (playMusic: SongResult) => {
    if (playMusic.playMusicUrl) {
      return playMusic;
    }
    playMusic.playLoading = true;
    const playMusicUrl = await getSongUrl(playMusic.id);
    const { backgroundColor, primaryColor } =
      playMusic.backgroundColor && playMusic.primaryColor
        ? playMusic
        : await getImageLinearBackground(getImgUrl(playMusic?.picUrl, '30y30'));

    playMusic.playLoading = false;
    return { ...playMusic, playMusicUrl, backgroundColor, primaryColor };
  }, [getSongUrl]);

  const loadLrc = useCallback(async (playMusicId: number): Promise<IParsedLyric> => {
    try {
      const { data } = await getMusicLrc(playMusicId);
      const lyrics = parseLyrics(data.lrc.lyric);
      const tlyric: Record<string, string> = {};

      if (data.tlyric.lyric) {
        const tLyrics = parseLyrics(data.tlyric.lyric);
        tLyrics.lyrics.forEach((lyric, index) => {
          tlyric[tLyrics.times[index].toString()] = lyric.text;
        });
      }

      lyrics.lyrics.forEach((item, index) => {
        item.trText = item.text ? tlyric[lyrics.times[index].toString()] || '' : '';
      });

      return {
        lrcTimeArray: lyrics.times,
        lrcArray: lyrics.lyrics,
      };
    } catch (err) {
      console.error('Error loading lyrics:', err);
      return {
        lrcTimeArray: [],
        lrcArray: [],
      };
    }
  }, []);

  const handlePlayMusic = useCallback(async (playMusic: SongResult) => {
    const updatedPlayMusic = await getSongDetail(playMusic);
    console.log('updatedPlayMusic',updatedPlayMusic)
    store.setPlayMusic(updatedPlayMusic);
    if (updatedPlayMusic.playMusicUrl) {
      store.setPlayMusicUrl(updatedPlayMusic.playMusicUrl);
      store.setIsPlay(true);
    }
    store.setPlay(true);

    document.title = `${updatedPlayMusic.name} - ${updatedPlayMusic?.song?.artists?.reduce((prev, curr) => `${prev}${curr.name}/`, '')}`;
    
    if (!updatedPlayMusic.lyric) {
      const lyrics = await loadLrc(updatedPlayMusic.id);
      store.updateLyrics(lyrics);
    }

    addMusic(updatedPlayMusic);
    
    const playListIndex = store.playList.findIndex((item: SongResult) => item.id === playMusic.id);
    store.setPlayListIndex(playListIndex);
  }, [store, getSongDetail, loadLrc, addMusic]);

  const setPlayList = useCallback((list: SongResult[]) => {
    store.setPlayList(list);
  }, [store]);

  const playNext = useCallback(async () => {
    const { playList, playListIndex, playMode } = store;
    if (playList.length === 0) return;

    let nextIndex = playListIndex;
    switch (playMode) {
      case 'sequence':
        nextIndex = playListIndex < playList.length - 1 ? playListIndex + 1 : -1;
        break;
      case 'loop':
        nextIndex = playListIndex < playList.length - 1 ? playListIndex + 1 : 0;
        break;
      case 'random':
        nextIndex = Math.floor(Math.random() * playList.length);
        break;
    }

    if (nextIndex !== -1) {
      await handlePlayMusic(playList[nextIndex]);
    }
  }, [store, handlePlayMusic]);

  const playPrev = useCallback(async () => {
    const { playList, playListIndex, playMode } = store;
    if (playList.length === 0) return;

    let prevIndex = playListIndex;
    switch (playMode) {
      case 'sequence':
      case 'loop':
        prevIndex = playListIndex > 0 ? playListIndex - 1 : playMode === 'loop' ? playList.length - 1 : -1;
        break;
      case 'random':
        prevIndex = Math.floor(Math.random() * playList.length);
        break;
    }

    if (prevIndex !== -1) {
      await handlePlayMusic(playList[prevIndex]);
    }
  }, [store, handlePlayMusic]);

  const playByIndex = useCallback(async (index: number) => {
    const { playList } = store;
    if (index >= 0 && index < playList.length) {
      const song = playList[index];
      await handlePlayMusic(song);
    }
  }, [store, handlePlayMusic]);

  const addToPlayList = useCallback((song: SongResult) => {
    const { playList } = store;
    const exists = playList.some(item => item.id === song.id);
    if (!exists) {
      store.setPlayList([...playList, song]);
    }
  }, [store]);

  const removeFromPlayList = useCallback((songId: number) => {
    const { playList, playListIndex } = store;
    const newList = playList.filter(item => item.id !== songId);
    store.setPlayList(newList);
    
    // 如果删除的是当前播放的歌曲，自动播放下一首
    if (playList[playListIndex]?.id === songId && newList.length > 0) {
      const nextIndex = Math.min(playListIndex, newList.length - 1);
      playByIndex(nextIndex);
    }
  }, [store, playByIndex]);

  const clearPlayList = useCallback(() => {
    store.setPlayList([]);
    store.setPlayListIndex(-1);
    store.setPlayMusic(null);
    store.setPlayMusicUrl(null);
    store.setPlay(false);
    store.setIsPlay(false);
  }, [store]);

  const toggleFavorite = useCallback((song: SongResult) => {
    store.toggleFavorite(song);
  }, [store]);

  return {
    handlePlayMusic,
    setPlayList,
    playNext,
    playPrev,
    playByIndex,
    addToPlayList,
    removeFromPlayList,
    clearPlayList,
    toggleFavorite,
  };
};

// 辅助函数
const parseLyrics = (lyricsString: string): { lyrics: ILyricText[]; times: number[] } => {
  const lines = lyricsString.split('\n');
  const lyrics: ILyricText[] = [];
  const times: number[] = [];
  
  lines.forEach(line => {
    const { time, text } = parseLyricLine(line);
    if (time !== null) {
      times.push(time);
      lyrics.push({ text, trText: '' });
    }
  });
  
  return { lyrics, times };
};

const parseLyricLine = (line: string): { time: number | null; text: string } => {
  const TIME_REGEX = /\[(\d{2}):(\d{2})(\.\d+)?\]/;
  const match = line.match(TIME_REGEX);
  
  if (!match) {
    return { time: null, text: line };
  }
  
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const milliseconds = match[3] ? parseFloat(match[3]) : 0;
  
  const time = minutes * 60 + seconds + milliseconds;
  const text = line.replace(TIME_REGEX, '').trim();
  
  return { time, text };
}; 