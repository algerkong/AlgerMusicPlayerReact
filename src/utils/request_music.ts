import axios from 'axios';

const baseURL = `${import.meta.env.VITE_MUSIC_API}`;

const requestMusic = axios.create({
  baseURL,
  timeout: 10000,
});

export default requestMusic;
