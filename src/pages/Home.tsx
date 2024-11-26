import { useEffect, useState } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getRecommendMusic } from '@/api/home';
import { useMusicList } from '@/hooks/useMusicList';
import type { SongResult } from '@/types/music';

const Home = () => {
  const [recommendSongs, setRecommendSongs] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { handlePlayMusic } = useMusicList();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data: { result } } = await getRecommendMusic({ limit: 12 });
        setRecommendSongs(result);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <Card title="推荐歌曲">
      <Row gutter={[16, 16]}>
        {loading ? (
          [...Array(12)].map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))
        ) : (
          recommendSongs.map(song => (
            <Col key={song.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <div className="relative group">
                    <img
                      alt={song.name}
                      src={song.picUrl}
                      className="aspect-square object-cover"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                        flex items-center justify-center transition-opacity cursor-pointer"
                      onClick={() => handlePlayMusic(song)}
                    >
                      <PlayCircleOutlined className="text-4xl text-white" />
                    </div>
                  </div>
                }
              >
                <Card.Meta
                  title={song.name}
                  description={song.ar?.map(artist => artist.name).join(', ')}
                />
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Card>
  );
};

export default Home; 