import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { JhiConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class JhiLanguageService {
  currentLang = 'en';

  constructor(private translateService: TranslateService, private configService: JhiConfigService) {}

  init(): void {
    const config = this.configService.getConfig();
    this.currentLang = config.defaultI18nLang;
    this.translateService.setDefaultLang(this.currentLang);
    this.translateService.use(this.currentLang);
  }

  changeLanguage(languageKey: string): void {
    this.currentLang = languageKey;
    this.configService.getConfig().defaultI18nLang = languageKey;
    this.translateService.use(this.currentLang);
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }
}
