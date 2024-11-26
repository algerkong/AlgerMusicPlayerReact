import { Button, Slider } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SoundOutlined,
  AudioMutedOutlined
} from '@ant-design/icons';
import useStore from '@/store';
import { useMusic } from '@/hooks/useMusic';
import { secondToMinute } from '@/utils';
import { useEffect } from 'react';

const Player = () => {
  const { playMusic, playMusicUrl, isPlay, playList, playListIndex } = useStore();
  const { 
    audioRef, 
    nowTime, 
    allTime, 
    setPlay,
    setIsPlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    handlePrevSong,
    handleNextSong,
    setNowTime,
    setAllTime
  } = useMusic();

  useEffect(() => {
    if (playMusicUrl && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Auto play failed:', error);
      });
      setPlay(true);
    }
  }, [playMusicUrl, setPlay]);

  if (!playMusic) return null;

  const progress = (nowTime / allTime) * 100;

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlay) {
        audioRef.current.pause();
        setIsPlay(false);
      } else {
        audioRef.current.play();
        setIsPlay(true);
      }
      setPlay(!isPlay);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  const handleProgressChange = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * allTime;
      setNowTime(time);
    }
  };

  const handleProgressChangeComplete = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * allTime;
      audioRef.current.currentTime = time;
    }
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    let isDragging = true;

    const startDrag = (moveEvent: MouseEvent) => {
      if (!isDragging) return;
      const rect = progressBar.getBoundingClientRect();
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clampedPercent = Math.min(Math.max(percent, 0), 100);
      handleProgressChange(clampedPercent);
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      const rect = progressBar.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const clampedPercent = Math.min(Math.max(percent, 0), 100);
      handleProgressChangeComplete(clampedPercent);
      document.removeEventListener('mousemove', startDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', startDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  return (  
    <div className="rounded-none border-t p-0">
      <div 
        className="cursor-pointer relative h-1 bg-[rgba(255,255,255,0.09)] group"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = ((e.clientX - rect.left) / rect.width) * 100;
          const clampedPercent = Math.min(Math.max(percent, 0), 100);
          handleProgressChangeComplete(clampedPercent);
        }}
        onMouseDown={handleProgressDrag}
      >
        <div 
          className="absolute inset-0 bg-[#1db954] transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <div className="flex justify-between px-2 text-xs text-gray-400 mt-1">
        <span>{secondToMinute(nowTime)}</span>
        <span>{secondToMinute(allTime)}</span>
      </div>

      <div className="p-4 grid grid-cols-3 items-center">
        <div className="flex items-center gap-4">
          <img 
            src={playMusic.picUrl} 
            alt={playMusic.name} 
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="font-medium text-black">{playMusic.name}</h3>
            <p className="text-sm text-gray-700">
              {playMusic.song.artists?.reduce((prev, curr, index) => 
                index === 0 ? curr.name : `${prev} / ${curr.name}`, 
              '')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button 
            type="text" 
            icon={<StepBackwardOutlined style={{ fontSize: '28px' }} />}
            onClick={handlePrevSong}
            disabled={playListIndex <= 0}
            className="p-4 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 w-16 h-16 flex items-center justify-center" 
          />
          <Button 
            type="text"
            icon={isPlay ? 
              <PauseCircleOutlined style={{ fontSize: '42px' }} /> : 
              <PlayCircleOutlined style={{ fontSize: '42px' }} />
            }
            onClick={handlePlayPause}
            className="p-4 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 w-20 h-20 flex items-center justify-center"
          />
          <Button 
            type="text" 
            icon={<StepForwardOutlined style={{ fontSize: '28px' }} />}
            onClick={handleNextSong}
            disabled={playListIndex >= playList.length - 1}
            className="p-4 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 w-16 h-16 flex items-center justify-center"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button 
            type="text" 
            icon={isMuted ? 
              <AudioMutedOutlined style={{ fontSize: '24px' }} /> : 
              <SoundOutlined style={{ fontSize: '24px' }} />
            }
            onClick={toggleMute}
            className="p-3 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 w-12 h-12 flex items-center justify-center"
          />
          <Slider 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={playMusicUrl || ''}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          if (!audio.paused) {
            setNowTime(audio.currentTime);
            setAllTime(audio.duration);
            setPlay(true);
          }
        }}
        onEnded={handleNextSong}
      />
    </div>
  );
};

export default Player; 