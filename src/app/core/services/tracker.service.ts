import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { MatomoTracker, MatomoInitializerService } from 'ngx-matomo-client';
import { APP_CONFIG } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrackerService {
  constructor(
    private electronService: ElectronService,
    private matomoTracker: MatomoTracker,
    private matomoInitializer: MatomoInitializerService
  ) {}

  initialize() {
    if (this.electronService.isElectron) {
      // Get machine ID via IPC
      this.electronService.ipcRenderer
        ?.invoke('get-machine-id')
        .then((machineId: string) => {
          const config = {
            scriptUrl: 'https://matomo.apps.tech.orange/matomo.js',
            trackers: [
              {
                trackerUrl: 'https://matomo.apps.tech.orange/',
                siteId: APP_CONFIG.TRACKER_ID,
              },
            ],
          };
          // Disable cookies to prevent coookie errors in production
          this.matomoTracker.disableCookies();
          this.matomoTracker.setDoNotTrack(true);

          // Set unique visitorId
          this.matomoTracker.setVisitorId(machineId);

          this.matomoTracker.requireConsent();
          this.matomoTracker.requireCookieConsent();
          this.matomoTracker.trackPageView();

          // Important to enable file tracking for production mode file://
          this.matomoTracker.enableFileTracking();

          // init tracker async to load it with visitorId
          this.matomoInitializer.initializeTracker(config);
        })
        .catch((error: any) => {
          console.error('Error getting machine ID:', error);
        });
    }
  }

  forgetConsentGiven() {
    this.matomoTracker.forgetConsentGiven();
    this.matomoTracker.forgetCookieConsentGiven();
    this.matomoTracker.deleteCookies();
  }

  setConsentGiven() {
    this.matomoTracker.rememberConsentGiven();
    this.matomoTracker.rememberCookieConsentGiven();
    this.matomoTracker.forgetUserOptOut();
  }

  trackEvent(data: any) {
    this.matomoTracker.trackEvent(
      data?.category,
      data?.action,
      data?.name,
      data?.value
    );
  }
}
