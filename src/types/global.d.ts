declare global {
  interface Window { ipcRenderer: any; }
}

export default global;