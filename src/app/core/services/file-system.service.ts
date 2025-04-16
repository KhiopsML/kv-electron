/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from './electron.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './config.service';
import { BehaviorSubject, Observable } from 'rxjs';
// @ts-ignore
import Toastify from 'toastify-js';
import { StorageService } from './storage.service';

let es: any;
try {
  es = require('event-stream');
} catch (e) {
  console.warn(e);
}
let jsonStream: any;
try {
  jsonStream = require('JSONStream');
} catch (e) {
  console.warn(e);
}

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  fileLoaderDatas?: {
    isLoadingDatas: any;
    datas: any;
    isBigJsonFile: boolean;
    loadingInfo: string;
  };

  private _fileLoaderSub: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public fileLoader$: Observable<any> = this._fileLoaderSub.asObservable();

  constructor(
    private ngzone: NgZone,
    private configService: ConfigService,
    private electronService: ElectronService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {
    this.initialize();
  }

  initialize() {
    this.fileLoaderDatas = {
      isLoadingDatas: false,
      datas: undefined,
      isBigJsonFile: false,
      loadingInfo: '',
    };
  }

  openFileDialog(callbackDone: Function) {
    // this.trackerService.trackEvent('click', 'open_file');

    const associationFiles = ['json'];
    associationFiles.push('khj');

    this.electronService.dialog
      .showOpenDialog(null, {
        properties: ['openFile'],
        filters: [
          {
            extensions: associationFiles,
          },
        ],
      })
      .then((result: Electron.OpenDialogReturnValue) => {
        if (result && !result.canceled && result.filePaths) {
          this.openFile(result.filePaths[0], callbackDone);
          return;
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  setTitleBar(filename: string) {
    // Set the filename to the title bar
    (async () => {
      try {
        await this.electronService.ipcRenderer?.invoke('set-title-bar-name', {
          title: 'Khiops Visualization ' + filename,
        });
      } catch (error) {
        console.log('error', error);
      }
    })();
  }

  openFile(filename: string, callbackDone?: Function) {
    if (filename) {
      // Important to reset datas before loading a new file
      this.configService.setDatas();

      this.readFile(filename)
        .then((datas: any) => {
          this.setTitleBar(filename);
          this.setFileHistory(filename);
          this.configService.setDatas(datas);
          if (callbackDone) {
            callbackDone();
          }
        })
        .catch((error: any) => {
          console.warn(this.translate.instant('OPEN_FILE_ERROR'), error);
          this.closeFile();
          Toastify({
            text: this.translate.instant('OPEN_FILE_ERROR'),
            gravity: 'bottom',
            position: 'center',
            duration: 3000,
          }).showToast();
          this._fileLoaderSub.next(this.fileLoaderDatas);
        });
    }
  }
  readFile(filename: string): any {
    this.fileLoaderDatas!.datas = undefined;
    this.fileLoaderDatas!.isLoadingDatas = true;
    this.fileLoaderDatas!.isBigJsonFile = false;
    this._fileLoaderSub.next(this.fileLoaderDatas);

    return new Promise((resolve, reject) => {
      this.electronService.fs.stat(filename, (err: any) => {
        if (err) {
          reject();
        } else {
          this.electronService.fs.readFile(
            filename,
            'utf-8',
            (errReadFile: NodeJS.ErrnoException, datas: string) => {
              if (errReadFile) {
                if (
                  errReadFile
                    .toString()
                    .startsWith('Error: Cannot create a string longer')
                ) {
                  this.fileLoaderDatas!.isBigJsonFile = true;
                  this.fileLoaderDatas!.loadingInfo = '';
                  this._fileLoaderSub.next(this.fileLoaderDatas);

                  const currentDatas: any = {};
                  const stream = this.electronService.fs.createReadStream(
                    filename,
                    {
                      encoding: 'utf8',
                    }
                  );
                  const getStream = stream.pipe(
                    jsonStream.parse([
                      {
                        emitKey: true,
                      },
                    ])
                  );
                  getStream.pipe(
                    es.map((pipeDatas: any) => {
                      this.fileLoaderDatas!.loadingInfo = pipeDatas.key;
                      currentDatas[pipeDatas.key] = pipeDatas.value;
                      this._fileLoaderSub.next(this.fileLoaderDatas);
                    })
                  );

                  getStream
                    .on('end', () => {
                      this.fileLoaderDatas!.datas = currentDatas;
                      this.fileLoaderDatas!.datas.filename = filename;
                      this.fileLoaderDatas!.isLoadingDatas = false;
                      this._fileLoaderSub.next(this.fileLoaderDatas);

                      resolve(this.fileLoaderDatas?.datas);
                    })
                    .on('error', () => {
                      reject();
                    });
                } else {
                  this.fileLoaderDatas!.isLoadingDatas = false;
                  this._fileLoaderSub.next(this.fileLoaderDatas);

                  reject(errReadFile);
                }
              } else {
                this.fileLoaderDatas!.isLoadingDatas = false;
                try {
                  this.fileLoaderDatas!.datas = JSON.parse(datas);
                  this.fileLoaderDatas!.datas.filename = filename;
                  this._fileLoaderSub.next(this.fileLoaderDatas);
                  resolve(this.fileLoaderDatas?.datas);
                } catch (e) {
                  Toastify({
                    text: this.translate.instant('OPEN_FILE_ERROR'),
                    gravity: 'bottom',
                    position: 'center',
                    duration: 3000,
                  }).showToast();
                  this._fileLoaderSub.next(this.fileLoaderDatas);
                  this.closeFile();
                  reject();
                }
              }
            }
          );
        }
      });
    });
  }

  closeFile() {
    this.initialize();
    this.ngzone.run(() => {
      this.configService.setDatas();
      this.setTitleBar('');
    });
  }

  setFileHistory(filename: string) {
    let filesHistory = this.storageService.getOne('OPEN_FILE');
    if (filesHistory) {
      const isExistingHistoryIndex = filesHistory.files.indexOf(filename);

      if (isExistingHistoryIndex !== -1) {
        // remove at index
        filesHistory.files.splice(isExistingHistoryIndex, 1);
      } else {
        // remove last item
        if (filesHistory.files.length >= 5) {
          filesHistory.files.splice(-1, 1);
        }
      }
    } else {
      filesHistory = {
        files: [],
      };
    }
    // add to the top of the list
    filesHistory.files.unshift(filename);
    this.storageService.setOne('OPEN_FILE', filesHistory);
  }

  getFileHistory() {
    const filesHistory = this.storageService.getOne('OPEN_FILE');
    return (
      filesHistory || {
        files: [],
      }
    );
  }
}
