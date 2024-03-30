import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', {
      reconnect: () => ipcRenderer.invoke('reconnect'),
      login: (params) => ipcRenderer.invoke('login', params),
      logout: () => ipcRenderer.invoke('logout'),
      addStudent: (params) => ipcRenderer.invoke('addStudent', params),
      getStudents: (params) => ipcRenderer.invoke('getStudents', params),
      getPaymentList: (params) => ipcRenderer.invoke('getPaymentList', params),
      searchStudents: (params) => ipcRenderer.invoke('searchStudents', params),
      getStudentPayments: (params) => ipcRenderer.invoke('getStudentPayments', params),
      addPayments: (params) => ipcRenderer.invoke('addPayments', params),
      getStudent: (params) => ipcRenderer.invoke('getStudent', params),
      updateStudent: (params) => ipcRenderer.invoke('updateStudent', params),
      getDueList: (params) => ipcRenderer.invoke('getDueList', params)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Context isolation must be enabled')
}
