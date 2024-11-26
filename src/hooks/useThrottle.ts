import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const lastArgs = useRef<any[]>();
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall.current;

    // 保存最新的参数
    lastArgs.current = args;

    // 如果距离上次调用的时间小于延迟时间，设置一个定时器
    if (timeSinceLastCall < delay) {
      // 清除之前的定时器
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // 设置新的定时器
      timeoutId.current = setTimeout(() => {
        lastCall.current = Date.now();
        fn(...(lastArgs.current as Parameters<T>));
      }, delay - timeSinceLastCall);

      return;
    }

    // 如果距离上次调用的时间大于延迟时间，直接调用
    lastCall.current = now;
    fn(...args);
  }, [fn, delay]) as T;
} 