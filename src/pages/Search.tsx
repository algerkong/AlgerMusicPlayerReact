import { useState } from 'react';
import { Input, Card, List, Avatar } from 'antd';
import { searchMusic } from '@/api/music';
import type { SongResult } from '@/types/music';

const { Search: SearchInput } = Input;

const Search = () => {
  const [results, setResults] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const { data } = await searchMusic(value);
      setResults(data.songs);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SearchInput
        placeholder="搜索音乐..."
        onSearch={handleSearch}
        size="large"
        loading={loading}
        className="mb-6"
      />
      
      <List
        dataSource={results}
        loading={loading}
        renderItem={song => (
          <List.Item>
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

export default Search; 