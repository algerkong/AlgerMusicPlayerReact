import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '@/store';
import { useMusicList } from '@/hooks/useMusicList';

const SongDetail = () => {
  const { id } = useParams();
  const { playMusic } = useStore();
  const { handlePlayMusic } = useMusicList();

  useEffect(() => {
    if (id && (!playMusic || playMusic.id !== Number(id))) {
      handlePlayMusic({ id: Number(id) } as any);
    }
  }, [id, playMusic, handlePlayMusic]);

  if (!playMusic) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-8">
        <img 
          src={playMusic.picUrl} 
          alt={playMusic.name}
          className="w-64 h-64 rounded-lg" 
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{playMusic.name}</h1>
          <p className="text-gray-500 mb-2">
            歌手：{playMusic.ar?.map((artist: { name: string }) => artist.name).join(', ')}
          </p>
          <p className="text-gray-500">
            专辑：{playMusic.al?.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongDetail; 