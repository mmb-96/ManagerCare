import { TranslateService } from '@ngx-translate/core';

import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';
import { JhiConfigService } from 'app/shared/jhipster-compat/config.service';
import { JhiLanguageService } from 'app/shared/jhipster-compat/language.service';

describe('JhiLanguageService compatibility', () => {
  let configService: JhiConfigService;
  let languageService: JhiLanguageService;
  let translateService: { setDefaultLang: jasmine.Spy; use: jasmine.Spy };

  beforeEach(() => {
    configService = new JhiConfigService(MANAGERCARE_CONFIG);
    translateService = {
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      use: jasmine.createSpy('use')
    };
    languageService = new JhiLanguageService((translateService as unknown) as TranslateService, configService);
  });

  it('initializes synchronously from the local default language', () => {
    languageService.init();

    expect(languageService.getCurrentLanguage()).toBe('es');
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('es');
    expect(translateService.use).toHaveBeenCalledWith('es');
  });

  it('changes the in-memory language, local config, and TranslateService synchronously', () => {
    languageService.changeLanguage('en');

    expect(languageService.getCurrentLanguage()).toBe('en');
    expect(configService.getConfig().defaultI18nLang).toBe('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });
});
