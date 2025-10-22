/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

/* eslint-disable no-console */
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './core/services/electron.service';
import { ConfigService } from './core/services/config.service';
import { MenuService } from './core/services/menu.service';
import { FileSystemService } from './core/services/file-system.service';
import { TrackerService } from './core/services/tracker.service';
import 'khiops-visualization';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('visualizationComponent', {
    static: false,
  })
  visualizationComponent?: ElementRef<HTMLElement>;

  config: any;
  btnUpdateText: string =
    '✅ ' + this.translate.instant('GLOBAL_UPDATE_UP_TO_DATE');
  btnUpdate?: string;

  constructor(
    public ngzone: NgZone,
    private electronService: ElectronService,
    private fileSystemService: FileSystemService,
    private storageService: StorageService,
    private configService: ConfigService,
    private translate: TranslateService,
    private menuService: MenuService,
    private trackerService: TrackerService
  ) {
    this.translate.setFallbackLang('en');

    this.trackerService.initialize();
  }

  ngAfterViewInit() {
    this.setAppConfig();
    if (this.electronService.isElectron) {
      this.addIpcRendererEvents();
    }
  }

  setAppConfig() {
    this.config = this.visualizationComponent?.nativeElement;

    //@ts-ignore
    this.config.setConfig({
      appSource: 'ELECTRON',
      storage: 'ELECTRON',
      onFileOpen: () => {
        console.log('fileOpen');
        this.menuService.openFileDialog(() => {
          this.constructMenu();
        });
      },
      onCopyImage: (base64data: any) => {
        const natImage =
          this.electronService.nativeImage.createFromDataURL(base64data);
        this.electronService.clipboard.writeImage(natImage);
      },
      onSendEvent: (event: { message: string; data: any }, cb?: Function) => {
        if (event.message === 'forgetConsentGiven') {
          this.trackerService.forgetConsentGiven();
        } else if (event.message === 'setConsentGiven') {
          this.trackerService.setConsentGiven();
        } else if (event.message === 'trackEvent') {
          this.trackerService.trackEvent(event.data);
        } else if (event.message === 'ls.getAll') {
          cb && cb(this.storageService.getAll());
        } else if (event.message === 'ls.saveAll') {
          this.storageService.saveAll();
        } else if (event.message === 'ls.delAll') {
          this.storageService.delAll();
        }
      },
    });
    this.configService.setConfig(this.config);
  }

  addIpcRendererEvents() {
    this.electronService.ipcRenderer?.on('update-available', (event, arg) => {
      console.info('update-available', event, arg);
      this.btnUpdate = 'update-available';
      this.btnUpdateText =
        '🔁 ' + this.translate.instant('GLOBAL_UPDATE_UPDATE_AVAILABLE');
      this.constructMenu();
    });
    this.electronService.ipcRenderer?.on(
      'update-not-available',
      (event, arg) => {
        console.info('update-not-available', event, arg);
        this.menuService.setUpdateInProgress(false);
      }
    );
    this.electronService.ipcRenderer?.on('update-error', (event, arg) => {
      console.info('update-error', event, arg);
      this.menuService.setUpdateInProgress(false);
      // this.btnUpdate = 'update-error';
      // this.btnUpdateText = '⚠ ' + this.translate.instant('GLOBAL_UPDATE_UPDATE_ERROR');
      this.constructMenu();
    });
    this.electronService.ipcRenderer?.on(
      'download-progress-info',
      (event, arg) => {
        console.info('download-progress-info', arg && arg.percent);
        if (arg.percent === 100) {
          this.btnUpdate = 'download-complete';
          this.btnUpdateText =
            '✅ ' + this.translate.instant('GLOBAL_UPDATE_DOWNLOAD_COMPLETE');
        } else {
          this.btnUpdate = 'downloading';
          this.btnUpdateText =
            '🔁 ' +
            this.translate.instant('GLOBAL_UPDATE_DOWNLOADING') +
            ' ' +
            parseInt(arg && arg.percent, 10) +
            '%';
        }
        this.constructMenu();
      }
    );
    this.electronService.ipcRenderer?.on('before-quit', (event, arg) => {
      this.beforeQuit();
    });

    this.constructMenu();

    // Get input file on windows
    const inputFile =
      this.electronService.ipcRenderer?.sendSync('get-input-file');
    if (inputFile && inputFile !== '.') {
      setTimeout(() => {
        this.fileSystemService.openFile(inputFile, () => {
          // Refresh
          this.constructMenu();
        });
      });
    }
    // Get input files on Mac or Linux
    this.electronService.ipcRenderer?.on('file-open-system', (event, arg) => {
      if (arg) {
        setTimeout(() => {
          this.fileSystemService.openFile(arg, () => {
            // Refresh
            this.constructMenu();
          });
        });
      }
    });
  }

  beforeQuit() {
    this.storageService.saveAll(() => {
      this.electronService.remote.app.exit(0);
    });
  }

  constructMenu() {
    const menuTemplate = this.menuService.setMenu(
      this.btnUpdate,
      this.btnUpdateText,
      () => {
        // Refresh
        this.constructMenu();
      },
      () => {
        // launch-update-available
        (async () => {
          this.menuService.setUpdateInProgress(true);

          this.btnUpdateText =
            '🔁 ' +
            this.translate.instant('GLOBAL_UPDATE_WAITING_FOR_DOWNLOAD') +
            ' ...';
          await this.electronService.ipcRenderer?.invoke(
            'launch-update-available'
          );
          this.constructMenu();
        })();
      }
    );
    const menu =
      this.electronService.remote.Menu.buildFromTemplate(menuTemplate);
    this.electronService.remote.Menu.setApplicationMenu(menu);
  }
}
