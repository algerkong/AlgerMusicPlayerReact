import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Spin, Drawer, Table } from 'antd';
import { getRecommendPlaylists, getPlaylistDetail } from '@/api/playlist';
import useStore from '@/store';
import { PlayCircleOutlined, PlusCircleOutlined, HeartOutlined, MoreOutlined } from '@ant-design/icons';
import { useThrottle } from '@/hooks/useThrottle';
import type { ColumnsType } from 'antd/es/table';
import { useMusicList } from '@/hooks/useMusicList';
import type { SongResult } from '@/types/music';

interface Playlist {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
}

interface Song {
  id: number;
  name: string;
  picUrl: string;
  song: {
    artists: Array<{ id: number; name: string }>;
    album: { id: number; name: string };
  };
}

const LIMIT = 30;
const THROTTLE_DELAY = 500; // 500ms的节流延迟
const SCROLL_THRESHOLD = 30; // 距离底部30px时触发加载

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { setPlayList } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false); // 使用ref来跟踪loading状态，避免闭包问题
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<{ songs: SongResult[]; name: string }>({
    songs: [],
    name: ''
  });
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { handlePlayMusic } = useMusicList();

  const columns: ColumnsType<SongResult> = [
    {
      title: '歌曲',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img src={record.picUrl} className="w-10 h-10 object-cover rounded" alt={record.name} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: '歌手',
      key: 'artists',
      render: (_, record) => record.song.artists.map(a => a.name).join('、'),
    },
    {
      title: '专辑',
      key: 'album',
      dataIndex: ['song', 'album', 'name'],
    },
    {
      title: '',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <PlayCircleOutlined 
            className="text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayMusic(record);
            }}
            title="播放"
          />
          <PlusCircleOutlined 
            className="text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToNext(record);
            }}
            title="下一首播放"
          />
          <HeartOutlined 
            className="text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite(record);
            }}
            title="收藏"
          />
          <MoreOutlined 
            className="text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreActions(record);
            }}
            title="更多"
          />
        </div>
      ),
    },
  ];

  const fetchPlaylists = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const res = await getRecommendPlaylists({
        limit: LIMIT,
        offset: offset
      });
      
      const newPlaylists = res.data.result.map((item: any) => ({
        id: item.id,
        name: item.name,
        picUrl: item.picUrl,
        playCount: item.playCount
      }));
  
      setPlaylists(prev => [...prev, ...newPlaylists]);
      setOffset(prev => prev + LIMIT);
      setHasMore(newPlaylists.length === LIMIT);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  const checkShouldLoadMore = useCallback(() => {
    if (!containerRef.current || loadingRef.current || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    
    // 只有当距离底部小于阈值时才加载更多
    if (distanceToBottom <= SCROLL_THRESHOLD) {
      fetchPlaylists();
    }
  }, [fetchPlaylists, hasMore]);

  // 使用节流hook包装检查函数
  const throttledCheckShouldLoadMore = useThrottle(checkShouldLoadMore, THROTTLE_DELAY);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', throttledCheckShouldLoadMore);
      return () => container.removeEventListener('scroll', throttledCheckShouldLoadMore);
    }
  }, [throttledCheckShouldLoadMore]);

  const handlePlaylistClick = async (id: number) => {
    try {
      setDrawerVisible(true);
      setDrawerLoading(true);
      
      const res = await getPlaylistDetail(id);
      const songs = res.data.playlist.tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        picUrl: track.al.picUrl,
        song: {
          artists: track.ar,
          album: track.al
        }
      }));
      
      setCurrentPlaylist({
        songs,
        name: res.data.playlist.name
      });
      setPlayList(songs);
    } catch (error) {
      console.error('Failed to fetch playlist detail:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handlePlay = (song: SongResult) => {
    // 播放当前歌曲
    handlePlayMusic(song)
  };

  const handleAddToNext = (song: Song) => {
    // TODO: 实现下一首播放功能
    console.log('Add to next:', song);
  };

  const handleFavorite = (song: Song) => {
    // TODO: 实现收藏功能
    console.log('Favorite:', song);
  };

  const handleMoreActions = (song: Song) => {
    // TODO: 实现更多操作菜单
    console.log('More actions:', song);
  };

  return (
    <div ref={containerRef} className="h-full overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6">推荐歌单</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist, index) => (
          <Card
            key={`${playlist.id}_${index}`}
            hoverable
            cover={
              <div className="relative group" onClick={() => handlePlaylistClick(playlist.id)}>
                <img
                  alt={playlist.name}
                  src={playlist.picUrl}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircleOutlined
                    className="text-4xl text-white cursor-pointer"
                  />
                </div>
                <div className="absolute top-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  {(playlist.playCount / 10000).toFixed(1)}万
                </div>
              </div>
            }
            styles={{
              body: { padding: '12px' }
            }}
            className="overflow-hidden"
          >
            <Card.Meta
              title={
                <div className="text-sm font-medium line-clamp-2">
                  {playlist.name}
                </div>
              }
            />
          </Card>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      )}
      {!hasMore && playlists.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          没有更多数据了
        </div>
      )}
      
      <Drawer
        title={currentPlaylist.name}
        placement="bottom"
        height="80vh"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        className="rounded-t-2xl"
      >
        <Spin spinning={drawerLoading}>
          <Table
            columns={columns}
            dataSource={currentPlaylist.songs}
            rowKey={(record, index) => `${record.id}_${record.song.album.id}_${index}`}
            pagination={false}
            className="playlist-songs-table"
            onRow={(record) => ({
              onClick: () => handlePlay(record),
              className: 'cursor-pointer hover:bg-gray-50'
            })}
          />
        </Spin>
      </Drawer>
    </div>
  );
};

export default Playlists; 