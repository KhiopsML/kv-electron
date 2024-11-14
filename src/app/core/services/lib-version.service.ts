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
