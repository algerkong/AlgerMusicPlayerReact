import request from '@/utils/request';
import requestMusic from '@/utils/request_music';
import type { IPlayMusicUrl, ILyric } from '@/types/music';

export const getMusicUrl = (id: number) => {
  return request.get<IPlayMusicUrl>('/song/url', { params: { id } });
};

export const searchMusic = (keywords: string) => {
  return request.get('/search', { params: { keywords } });
};

export const getMusicDetail = (ids: number[]) => {
  return request.get('/song/detail', { params: { ids: ids.join(',') } });
};

export const getMusicLrc = (id: number) => {
  return request.get<ILyric>('/lyric', { params: { id } });
};

export const getParsingMusicUrl = (id: number) => {
  return requestMusic.get<any>('/music', { params: { id } });
};
