import { Injectable } from '@angular/core';
let pjson;
try {
  pjson = require('../../../../package.json');
} catch (e) {
  console.warn('Can not access pjson on browser', e);
}

@Injectable({
  providedIn: 'root',
})
export class LibVersionService {

  static getAppVersion() {
    return (pjson && pjson.version) || undefined;
  }
  static getAppTitle() {
    return (pjson && pjson.title) || undefined;
  }
  static getAppName() {
    return (pjson && pjson.name) || undefined;
  }
}
