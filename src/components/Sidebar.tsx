import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  SearchOutlined,
  HistoryOutlined,
  HeartOutlined,
  OrderedListOutlined
} from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();
  
  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: <Link to="/search">搜索</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">播放历史</Link>,
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: <Link to="/favorites">我的收藏</Link>,
    },
    {
      key: '/playlist',
      icon: < OrderedListOutlined/>,
      label: <Link to="/playlist">播放列表</Link>,
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      className="h-full border-r-0"
    />
  );
};

export default Sidebar; 