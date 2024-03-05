import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', {
      reconnect: () => ipcRenderer.invoke('reconnect'),
      login: (params) => ipcRenderer.invoke('login', params),
      logout: () => ipcRenderer.invoke('logout'),
      addStudent: (params) => ipcRenderer.invoke('addStudent', params),
      getStudents: () => ipcRenderer.invoke('getStudents'),
      getPaymentList: () => ipcRenderer.invoke('getPaymentList'),
      searchStudents: (params) => ipcRenderer.invoke('searchStudents', params),
      getStudentPayments: (params) => ipcRenderer.invoke('getStudentPayments', params),
      addPayments: (params) => ipcRenderer.invoke('addPayments', params),
      getDueList: () => ipcRenderer.invoke('getDueList')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Context isolation must be enabled')
}
