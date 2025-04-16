/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: any = undefined;
  private _storageKey: string = 'KHIOPS_VISUALIZATION_';

  constructor(private electronService: ElectronService) {
    this.electronService.storage.setDataPath(this.electronService.os.tmpdir());
    this.getAll();
  }

  saveAll(cb?: Function) {
    this.electronService.storage?.set(this._storageKey, this._storage, () => {
      cb && cb();
    });
  }

  getAll() {
    try {
      this._storage = this.electronService.storage?.getSync(this._storageKey);
    } catch {
      this.electronService.storage?.set(this._storageKey, {});
    }
    return this._storage;
  }

  delAll() {
    this.electronService.storage?.clear();
  }

  getOne(elt: string) {
    return this._storage ? this._storage[elt] : undefined;
  }

  setOne(elt: string, value: any) {
    this._storage[elt] = value;
  }
}
