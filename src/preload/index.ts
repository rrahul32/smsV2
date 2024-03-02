import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', {
      reconnect: () => ipcRenderer.invoke('reconnect'),
      login: (params) => ipcRenderer.invoke('login', params),
      logout: () => ipcRenderer.invoke('logout')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Context isolation must be enabled')
}
