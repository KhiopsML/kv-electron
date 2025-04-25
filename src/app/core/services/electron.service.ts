/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
let fs: any;
try {
  fs = require('fs');
} catch (e) {
  console.warn(e);
}

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer?: typeof ipcRenderer;
  webFrame?: typeof webFrame;
  childProcess?: typeof childProcess;
  fs: typeof fs;
  dialog: any;
  electron: any;
  remote: any;
  shell: any;
  clipboard: any;
  nativeImage: any;
  storage: any;
  os: any;

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.dialog = window.require('@electron/remote').dialog;
      this.remote = window.require('@electron/remote');
      this.electron = window.require('electron');
      this.shell = this.electron.shell;
      this.clipboard = window.require('electron').clipboard;
      this.nativeImage = window.require('electron').nativeImage;
      this.storage = window.require('electron-json-storage');
      this.os = window.require('os');

      // this.childProcess.exec('node -v', (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`error: ${error.message}`);
      //     return;
      //   }
      //   if (stderr) {
      //     console.error(`stderr: ${stderr}`);
      //     return;
      //   }
      //   console.log(`stdout:\n${stdout}`);
      // });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}
