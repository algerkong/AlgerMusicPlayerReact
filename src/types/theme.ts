import type { ThemeConfig } from 'antd';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
} 