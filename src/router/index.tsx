import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import SongDetail from '@/pages/SongDetail';
import History from '@/pages/History';
import Favorites from '@/pages/Favorites';
import Playlist from '@/pages/Playlists';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'song/:id',
        element: <SongDetail />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path: 'playlist',
        element: <Playlist/>
      }
    ],
  },
]); 