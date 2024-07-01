import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './electron.service';
import { FileSystemService } from './file-system.service';
import { LibVersionService } from './lib-version.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private currentChannel =
    localStorage.getItem('KHIOPS_VISUALIZATION_CHANNEL') || 'latest';

  private updateInProgress = false;

  constructor(
    private electronService: ElectronService,
    private configService: ConfigService,
    private translate: TranslateService,
    private fileSystemService: FileSystemService
  ) {}

  setUpdateInProgress(value = false) {
    this.updateInProgress = value;
  }

  setMenu(
    btnUpdate = '',
    btnUpdateText = '',
    refreshCb = undefined,
    updateCb = undefined
  ) {
    const opendFiles = this.fileSystemService.getFileHistory();

    const menu1 = {
      label: this.translate.instant('GLOBAL_MENU_FILE'),
      submenu: [
        {
          label: this.translate.instant('GLOBAL_MENU_OPEN'),
          click: () => {
            // this.trackerService.trackEvent('click', 'open_file');
            this.openFileDialog(refreshCb);
          },
        },
        {
          type: 'separator',
        },
        {
          type: 'separator',
        },
        {
          label: this.translate.instant('GLOBAL_MENU_CLOSE_FILE'),
          click: () => {
            // this.trackerService.trackEvent('click', 'close_file');
            this.closeFile();
          },
        },
        // {
        // 	type: 'separator'
        // },
        // {
        // 	label: this.translate.instant('GLOBAL_MENU_SAVE'),
        // 	click: () => {
        // 		this.save();
        // 	}
        // },
        // {
        // 	label: this.translate.instant('GLOBAL_MENU_SAVE_AS'),
        // 	click: () => {
        // 		this.saveAs();
        // 	}
        // },
        {
          type: 'separator',
        },
        {
          label: this.translate.instant('GLOBAL_MENU_RESTART_APP'),
          click: () => {
            // this.trackerService.trackEvent('click', 'restart_app');
            this.electronService.remote.app.relaunch();
            this.electronService.remote.app.exit(0);
          },
        },
        {
          label: this.translate.instant('GLOBAL_MENU_EXIT'),
          click: () => {
            // this.trackerService.trackEvent('click', 'exit_app');
            this.electronService.remote.app.quit();
          },
        },
      ],
    };

    // insert history files
    if (opendFiles.files.length > 0) {
      // in reverse order
      for (let i = opendFiles.files.length - 1; i >= 0; i--) {
        if (typeof opendFiles.files[i] === 'string') {
          menu1.submenu.splice(2, 0, {
            label: this.fileSystemService.getFileHistory().files[i],
            click: () => {
              // this.trackerService.trackEvent('click', 'open_file');
              this.openFile(
                this.fileSystemService.getFileHistory().files[i],
                refreshCb
              );
            },
          });
        }
      }
    }

    const menu2 = {
      label: this.translate.instant('GLOBAL_MENU_HELP'),
      submenu: [
        {
          role: 'toggleDevTools',
          click: () => {
            // this.trackerService.trackEvent('page_view', 'debugger');
          },
        },
        {
          type: 'separator',
        },
        {
          label:
            this.translate.instant('GLOBAL_MENU_VERSION') +
            ' ' +
            LibVersionService.getAppVersion(),
          click: () => {
            this.electronService.shell.openExternal(
              'https://github.com/KhiopsML/kv-electron/releases'
            );
          },
        },
        // {
        //   label:
        //     this.translate.instant('GLOBAL_MENU_LIB_VERSION') +
        //     ' ' +
        //     LibVersionService.getAppVersion(),
        // },
        {
          label: this.translate.instant('GLOBAL_MENU_RELEASE_NOTES'),
          click: () => {
            // this.trackerService.trackEvent('page_view', 'release_notes');
            this.electronService.shell.openExternal(
              'https://github.com/KhiopsML/kv-electron/releases'
            );
          },
        },
        {
          label: this.translate.instant('GLOBAL_MENU_CHANNELS'),
          submenu: [
            {
              label: this.translate.instant('GLOBAL_MENU_LATEST'),
              type: 'radio',
              click: () => {
                if (this.currentChannel !== 'latest') {
                  // this.trackerService.trackEvent('click', 'release', 'latest');
                  this.setChannel('latest');
                }
              },
              checked: this.currentChannel === 'latest',
            },
            {
              label: this.translate.instant('GLOBAL_MENU_BETA'),
              type: 'radio',
              click: () => {
                if (this.currentChannel !== 'beta') {
                  this.configService.openChannelDialog((e) => {
                    if (e === 'confirm') {
                      // User confirm
                      this.setChannel('beta');
                    } else if (e === 'cancel') {
                      this.setChannel('latest');
                      // re construct the menu to set channel to latest
                      refreshCb();
                    }
                  });
                }
              },
              checked: this.currentChannel === 'beta',
            },
          ],
        },
      ],
    };

    const menu3 = {
      label: this.translate.instant('GLOBAL_MENU_VIEW'),
      submenu: [
        {
          role: 'togglefullscreen',
          click: () => {
            // this.trackerService.trackEvent('click', 'full_screen');
          },
        },
        {
          type: 'separator',
        },
        {
          role: 'resetZoom',
          accelerator: 'CommandOrControl+nummult',
          click: () => {
            // this.trackerService.trackEvent('click', 'zoom', 'reset');
          },
        },
        {
          role: 'zoomIn',
          accelerator: 'CommandOrControl+numadd',
          click: () => {
            // this.trackerService.trackEvent('click', 'zoom', 'in');
          },
        },
        {
          role: 'zoomOut',
          accelerator: 'CommandOrControl+numsub',
          click: () => {
            // this.trackerService.trackEvent('click', 'zoom', 'out');
          },
        },
      ],
    };

    const menu4 = {
      label: this.translate.instant('GLOBAL_MENU_REPORT_A_BUG'),

      click: () => {
        // this.trackerService.trackEvent('page_view', 'report_issue');
        const emailId = 'bug.khiopsvisualization@orange.com';
        const subject =
          LibVersionService.getAppTitle() +
          ': ' +
          this.translate.instant('GLOBAL_MENU_REPORT_A_BUG');
        const message =
          '\n\n--------------------------------------------------\n' +
          this.translate.instant('GLOBAL_MENU_VERSION') +
          ': ' +
          LibVersionService.getAppVersion() +
          '\n';
        // this.translate.instant('GLOBAL_MENU_LIB_VERSION') +
        // ': ' +
        // LibVersionService.getAppVersion() +
        // '\n';
        this.electronService.shell.openExternal(
          'mailto:' +
            emailId +
            '?subject=' +
            subject +
            '&body=' +
            encodeURIComponent(message),
          // @ts-ignore
          '_self'
        );
      },
    };

    const menuTemplate = [];
    menuTemplate.push(menu1);
    menuTemplate.push(menu3);
    menuTemplate.push(menu2);
    menuTemplate.push(menu4);
    if (btnUpdate) {
      const menu5 = {
        label: btnUpdateText,
        click: () => {
          // this.trackerService.trackEvent('click', 'update_version');
          if (btnUpdate === 'update-available' && !this.updateInProgress) {
            updateCb();
          }
        },
      };

      menuTemplate.push(menu5);
    }

    return menuTemplate;
  }

  openFileDialog(cb: any = undefined) {
    this.fileSystemService.openFileDialog(() => {
      cb();
    });
  }

  openFile(filename, callbackDone) {
    this.fileSystemService.openFile(filename, () => {
      callbackDone();
    });
  }

  closeFile() {
    this.fileSystemService.closeFile();
  }

  setChannel(channel) {
    localStorage.setItem('KHIOPS_VISUALIZATION_CHANNEL', channel);
    this.currentChannel = channel;

    (async () => {
      try {
        await this.electronService.ipcRenderer.invoke(
          'launch-check-for-update'
        );
      } catch (error) {
        console.log('error', error);
      }
    })();
  }

  save() {
    // this.fileSaverService.save(this.appName, this.saveService.constructDatasToSave());
  }

  saveAs() {
    // this.fileSaverService.saveAs(this.saveService.constructDatasToSave());
  }
}
