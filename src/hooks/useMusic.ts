import { useRef, useState, useEffect, useCallback } from 'react';
import type { ILyricText } from '@/types/music';
import useStore from '@/store';

export const useMusic = () => {
  const [nowTime, setNowTime] = useState(0);
  const [allTime, setAllTime] = useState(0);
  const [nowIndex, setNowIndex] = useState(0);
  const [correctionTime, setCorrectionTime] = useState(0.4);
  const [currentLrcProgress, setCurrentLrcProgress] = useState(0);
  const [lrcArray, setLrcArray] = useState<ILyricText[]>([]);
  const [lrcTimeArray, setLrcTimeArray] = useState<number[]>([]);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playMusic, setPlay, playList, playListIndex, setPlayListIndex, setIsPlay } = useStore();

  useEffect(() => {
    if (playMusic?.lyric) {
      setLrcArray(playMusic.lyric.lrcArray || []);
      setLrcTimeArray(playMusic.lyric.lrcTimeArray || []);
    }
  }, [playMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        setNowTime(audio.currentTime);
        setAllTime(audio.duration);
      };

      const handlePlay = () => {
        setIsPlay(true);
        setPlay(true);
      };

      const handlePause = () => {
        setIsPlay(false);
        setPlay(false);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [setPlay, setIsPlay]);

  const addCorrectionTime = useCallback((time: number) => {
    setCorrectionTime(prev => prev + time);
  }, []);

  const reduceCorrectionTime = useCallback((time: number) => {
    setCorrectionTime(prev => prev - time);
  }, []);

  const isCurrentLrc = useCallback((index: number, time: number): boolean => {
    const currentTime = lrcTimeArray[index];
    const nextTime = lrcTimeArray[index + 1];
    const nowTime = time + correctionTime;
    return nowTime > currentTime && nowTime < nextTime;
  }, [lrcTimeArray, correctionTime]);

  const getLrcIndex = useCallback((time: number): number => {
    for (let i = 0; i < lrcTimeArray.length; i++) {
      if (isCurrentLrc(i, time)) {
        setNowIndex(i);
        return i;
      }
    }
    return nowIndex;
  }, [lrcTimeArray, isCurrentLrc, nowIndex]);

  const getLrcStyle = useCallback((index: number) => {
    if (index === nowIndex) {
      return {
        backgroundImage: `linear-gradient(to right, #ffffff ${currentLrcProgress}%, #ffffff8a ${currentLrcProgress}%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        transition: 'background-image 0.1s linear',
      };
    }
    return {};
  }, [nowIndex, currentLrcProgress]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handlePrevSong = useCallback(() => {
    if (playListIndex > 0) {
      setPlayListIndex(playListIndex - 1);
    }
  }, [playListIndex, setPlayListIndex]);

  const handleNextSong = useCallback(() => {
    if (playListIndex < playList.length - 1) {
      setPlayListIndex(playListIndex + 1);
    }
  }, [playList.length, playListIndex, setPlayListIndex]);

  // ... 其他方法的转换

  return {
    nowTime,
    allTime,
    nowIndex,
    lrcArray,
    lrcTimeArray,
    currentLrcProgress,
    audioRef,
    addCorrectionTime,
    reduceCorrectionTime,
    getLrcStyle,
    getLrcIndex,
    setNowTime,
    setAllTime,
    setCurrentLrcProgress,
    setPlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    handlePrevSong,
    handleNextSong,
    setIsPlay,
  };
}; 