import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BigFileLoadingComponent } from './big-file-loading/big-file-loading.component';
import { CommonModule } from '@angular/common';
import { MatomoModule } from 'ngx-matomo-client';
import { APP_CONFIG } from '../environments/environment';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

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
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatomoModule.forRoot({
      scriptUrl: 'https://matomo.apps.tech.orange/matomo.js',
      trackers: [
        {
          trackerUrl: 'https://matomo.apps.tech.orange/',
          siteId: APP_CONFIG.TRACKER_ID,
        },
      ],
    }),
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
