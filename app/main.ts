import { app, BrowserWindow, screen, nativeTheme } from 'electron';
import * as electron from 'electron';
import * as remoteMain from '@electron/remote/main';
remoteMain.initialize();
import * as path from 'path';
import * as fs from 'fs';
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');
const { dialog } = require('electron');
const { ipcMain } = require('electron');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

log.transports.file.level = 'info';
// log.transports.file.file = __dirname + '/electron.log';
log.warn('App starting...');
log.error('App starting...');
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = false;

// Try to fix ERR_HTTP2_PROTOCOL_ERROR
// https://github.com/electron-userland/electron-builder/issues/4987
app.commandLine.appendSwitch('disable-http2');
autoUpdater.requestHeaders = {
  'Cache-Control':
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
};

// return input files on Mac and Linux
let fileToLoad;
app.on('will-finish-launching', function () {
  log.info('will-finish-launching');

  app.on('open-file', function (event, filepath) {
    fileToLoad = filepath;
    event.preventDefault();

    if (fileToLoad) {
      log.info('fileToLoad');
      setTimeout(function () {
        if (win && win.webContents && fileToLoad) {
          win.webContents.send('file-open-system', fileToLoad);
        }
      }, 2000);
    }
  });
});

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new electron.BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    minWidth: 600,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

  // Enable remote for main process
  require('@electron/remote/main').enable(win);
  // Enable remote for renderer process
  require('@electron/remote/main').enable(win.webContents);

  // Disable default menu
  win.setMenu(null);

  // win.webContents.openDevTools();

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));

    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('get-input-file', async (event, arg) => {
  try {
    log.info('get-input-file');
    // return input files on Windows
    event.returnValue = process.argv[1];
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('launch-update-available', async (event, arg) => {
  try {
    log.info('launch-update-available');
    autoUpdater.downloadUpdate();
    return;
  } catch (error) {
    console.log('error', error);
  }
});

ipcMain.handle('launch-check-for-update', async (event, arg) => {
  try {
    log.info('launch-check-for-update');
    checkForUpdates();
  } catch (error) {
    console.log('error', error);
  }
});

function checkForUpdates() {
  win.webContents
    .executeJavaScript(
      'localStorage.getItem("KHIOPS_VISUALIZATION_CHANNEL");',
      true
    )
    .then((result) => {
      console.log(result);
      log.info('channel', result);
      const userChannel = result || 'latest';
      autoUpdater.allowPrerelease = userChannel === 'beta';

      log.info('checkForUpdates');
      autoUpdater.checkForUpdates();
    });
}

ipcMain.handle('set-title-bar-name', async (event, arg) => {
  win.setTitle(arg && arg.title);
});

ipcMain.handle('set-dark-mode', () => {
  nativeTheme.themeSource = 'dark';
});

ipcMain.handle('set-light-mode', () => {
  nativeTheme.themeSource = 'light';
});

autoUpdater.on('checking-for-update', () => {
  log.info('checking-for-update');
});
autoUpdater.on('update-available', (info) => {
  log.info('update-available', info);
  // const dialogOpts: any = {
  //   type: 'info',
  //   title: 'Found Updates',
  //   message: 'Found updates, do you want update now ?',
  //   buttons: ['Ok', 'Cancel']
  // };

  // dialog.showMessageBox(win, dialogOpts).then(function (res) {
  //   log.info('showMessageBox', res);
  //   if (res.response === 0) {
  //     autoUpdater.downloadUpdate();
  //   }
  // });
  setTimeout(function () {
    if (win && win.webContents) {
      win.webContents.send('update-available', info);
    }
  }, 2000);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('update-not-available', info);
  setTimeout(function () {
    if (win && win.webContents) {
      win.webContents.send('update-not-available', info);
    }
  }, 2000);
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info('download-progress', progressObj);
  if (win && win.webContents) {
    win.webContents.send('download-progress-info', progressObj);
  }
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  log.info('update-downloaded', event);

  const dialogOpts = {
    type: 'info',
    buttons: ['Restart and install'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  };

  //@ts-ignore
  dialog.showMessageBox(win, dialogOpts).then(function (res) {
    log.info('showMessageBox', res);
    if (res.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (message) => {
  log.info('error', message);

  setTimeout(function () {
    if (win && win.webContents) {
      win.webContents.send('update-error', message);
    }
  }, 2000);
});
