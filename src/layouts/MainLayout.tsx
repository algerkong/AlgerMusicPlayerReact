import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import { ThemeToggle } from '@/components/ThemeToggle';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const { token } = theme.useToken();

  return (
    <Layout className="h-screen">
      <Header style={{ background: token.colorBgContainer }} className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold">Music App</h1>
        <ThemeToggle />
      </Header>
      
      <Layout>
        <Sider width={250} style={{ background: token.colorBgContainer }}>
          <Sidebar />
        </Sider>
        <Content className="p-6 overflow-auto">
          <Outlet />
        </Content>
      </Layout>
      
      <Player />
    </Layout>
  );
};

export default MainLayout; 