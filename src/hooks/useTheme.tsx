import { useState, useEffect } from 'react';
import { theme as antTheme, type ThemeConfig } from 'antd';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
}

export const useTheme = (): ThemeContextType => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const themeConfig: ThemeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1db954',
      borderRadius: 8,
    },
    components: {
      Layout: {
        bodyBg: theme === 'dark' ? '#121212' : '#ffffff',
        headerBg: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        siderBg: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      },
      Card: {
        colorBgContainer: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      },
      Menu: {
        darkItemBg: '#1a1a1a',
        darkItemHoverBg: '#282828',
        darkItemSelectedBg: '#282828',
      },
    },
  };

  return { theme, toggleTheme, themeConfig };
}; 