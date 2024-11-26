import { Card, List, Avatar, Button } from 'antd';
import useStore from '@/store';
import { useMusicList } from '@/hooks/useMusicList';

const Favorites = () => {
  const { favorites } = useStore();
  const { handlePlayMusic, toggleFavorite } = useMusicList();

  return (
    <Card title="我的收藏">
      <List
        dataSource={favorites}
        renderItem={(song) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handlePlayMusic(song)}>播放</Button>,
              <Button type="link" danger onClick={() => toggleFavorite(song)}>取消收藏</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={song.picUrl} shape="square" size={48} />}
              title={song.name}
              description={song.ar?.map(artist => artist.name).join(', ')}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Favorites; 