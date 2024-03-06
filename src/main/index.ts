import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { PaymentsService } from './lib/payments'
import { Database } from './lib/realm'
import { StudentsService } from './lib/students'
import { UsersService } from './lib/users'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'SMS',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const database = new Database()
  const usersService = new UsersService(database)
  const studentsService = new StudentsService(database)
  const paymentsService = new PaymentsService(database)

  /**
   * IPC methods
   * **/
  ipcMain.handle('reconnect', () => database.reconnect())

  ipcMain.handle('login', (_, params) => {
    return usersService.login(params)
  })

  ipcMain.handle('addStudent', (_, params) => {
    return studentsService.addStudent(params)
  })

  ipcMain.handle('addPayments', (_, params) => {
    return paymentsService.addPayments(params)
  })

  ipcMain.handle('getStudents', () => {
    return studentsService.getStudents()
  })

  ipcMain.handle('getDueList', () => {
    return studentsService.getDueList()
  })

  ipcMain.handle('getPaymentList', () => {
    return paymentsService.getPaymentList()
  })

  ipcMain.handle('searchStudents', (_, params) => {
    return studentsService.searchStudents(params)
  })

  ipcMain.handle('getStudent', (_, params) => {
    return studentsService.getStudent(params)
  })

  ipcMain.handle('getStudentPayments', (_, params) => {
    return paymentsService.getStudentPayments(params)
  })

  /**
   * IPC methods end
   * **/

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
