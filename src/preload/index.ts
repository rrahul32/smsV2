import { contextBridge } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', {
      test: () => console.log('Test')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Context isolation must be enabled')
}
