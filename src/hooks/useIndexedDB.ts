import { useRef } from 'react';

const useIndexedDB = () => {
  const db = useRef<IDBDatabase | null>(null);

  const initDB = (dbName: string, version: number, stores: { name: string; keyPath?: string }[]) => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, {
              keyPath: store.keyPath || 'id',
              autoIncrement: true,
            });
          }
        });
      };

      request.onsuccess = (event) => {
        db.current = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  const addData = (storeName: string, value: unknown) => {
    return new Promise<void>((resolve, reject) => {
      if (!db.current) return reject('数据库未初始化');
      const tx = db.current.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(value);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  };

  // ... 其他方法保持类似的转换模式

  return {
    initDB,
    addData,
    // ... 其他方法
  };
};

export default useIndexedDB; 