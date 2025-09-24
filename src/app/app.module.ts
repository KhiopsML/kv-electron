/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

// NG Translate
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import {
  provideTranslateHttpLoader,
  TranslateHttpLoader,
} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BigFileLoadingComponent } from './big-file-loading/big-file-loading.component';
import { CommonModule } from '@angular/common';
import { MatomoModule } from 'ngx-matomo-client';

export function setupTranslateFactory(service: TranslateService) {
  const serv = () => service.use('en');
  return serv;
}

@NgModule({
  declarations: [AppComponent, BigFileLoadingComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    MatomoModule.forRoot({
      mode: 'deferred', // defer loading to set unique visitorId
    }),
  ],
  providers: [
    TranslateService,
    provideAppInitializer(() => {
      const initializerFn = setupTranslateFactory(inject(TranslateService));
      return initializerFn();
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
