/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { Injectable } from '@angular/core';
import packageInfo from '../../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class LibVersionService {
  static getAppVersion() {
    return packageInfo.version || undefined;
  }
  static getAppTitle() {
    return packageInfo.title || undefined;
  }
  static getAppName() {
    return packageInfo.name || undefined;
  }
  static getLibVersion() {
    return packageInfo.dependencies['khiops-visualization'] || undefined;
  }
}
