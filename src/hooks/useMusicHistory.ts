import { useState, useEffect } from 'react';
import type { SongResult } from '@/types/music';

export const useMusicHistory = () => {
  const [musicHistory, setMusicHistory] = useState<SongResult[]>(() => {
    const saved = localStorage.getItem('musicHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('musicHistory', JSON.stringify(musicHistory));
  }, [musicHistory]);

  const addMusic = (music: SongResult) => {
    setMusicHistory(prev => {
      const index = prev.findIndex(item => item.id === music.id);
      if (index !== -1) {
        const newHistory = [...prev];
        newHistory[index].count = (newHistory[index].count || 0) + 1;
        const [moved] = newHistory.splice(index, 1);
        return [moved, ...newHistory];
      }
      return [{ ...music, count: 1 }, ...prev];
    });
  };

  const delMusic = (music: SongResult) => {
    setMusicHistory(prev => prev.filter(item => item.id !== music.id));
  };

  return {
    musicHistory,
    addMusic,
    delMusic,
  };
}; 