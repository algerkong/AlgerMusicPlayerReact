import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeContextType } from '@/types/theme';

function App() {
  const { themeConfig } = useTheme() as ThemeContextType;

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </ConfigProvider>
  );
}

export default App;
