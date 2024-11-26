import request from '@/utils/request';

// 获取推荐歌单
export const getRecommendPlaylists = (params:{
  limit: number,
  offset: number
}) => {
  return request.get('/personalized', {
    params
  });
};

// 获取歌单详情
export const getPlaylistDetail = (id: number) => {
  return request.get('/playlist/detail', {
    params: {
      id
    }
  });
}; 