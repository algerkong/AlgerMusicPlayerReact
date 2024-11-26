interface Route {
  path: string;
  name: string;
  component?: React.ComponentType;
  children?: Route[];
}

const routes: Route[] = [
  // 你的路由配置
];

export default routes; 