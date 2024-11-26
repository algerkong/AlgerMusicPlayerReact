import { Card, List, Avatar, Button } from 'antd';
import { useMusicHistory } from '@/hooks/useMusicHistory';
import { useMusicList } from '@/hooks/useMusicList';
import type { SongResult } from '@/types/music';

const History = () => {
  const { musicHistory, delMusic } = useMusicHistory();
  const { handlePlayMusic } = useMusicList();

  return (
    <Card title="播放历史">
      <List
        dataSource={musicHistory}
        renderItem={(song: SongResult) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handlePlayMusic(song)}>播放</Button>,
              <Button type="link" danger onClick={() => delMusic(song)}>删除</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={song.picUrl} shape="square" size={48} />}
              title={song.name}
              description={song.ar?.map(artist => artist.name).join(', ')}
            />
            <div className="text-gray-500">
              播放次数：{song.count}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default History; 