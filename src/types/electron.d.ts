interface IpcRenderer {
  setStoreValue: (key: string, value: string) => void;
}

interface Electron {
  ipcRenderer: IpcRenderer;
}

declare global {
  interface Window {
    electron?: Electron;
  }
}

export {}; 