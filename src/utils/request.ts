import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = `${import.meta.env.VITE_API}`;

const request = axios.create({
  baseURL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求发送之前做一些处理
    // 在get请求params中添加timestamp
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        timestamp: Date.now(),
      };
      const token = localStorage.getItem('token');
      if (token) {
        config.params.cookie = token;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    // 当请求异常时做一些处理
    return Promise.reject(error);
  },
);

export default request;
