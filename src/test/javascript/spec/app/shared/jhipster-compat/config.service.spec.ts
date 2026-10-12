import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';
import { JhiConfigService } from 'app/shared/jhipster-compat/config.service';

describe('JhiConfigService compatibility', () => {
  it('exposes ManagerCare defaults through a mutable configuration object', () => {
    const service = new JhiConfigService(MANAGERCARE_CONFIG);
    const config = service.getConfig();

    expect(config).toEqual({
      alertAsToast: false,
      alertTimeout: 5000,
      i18nEnabled: true,
      defaultI18nLang: 'es',
      noi18nMessage: 'translation-not-found'
    });
    expect(service.getConfig()).toBe(config);
  });

  it('keeps defaultI18nLang mutable without replacing the configuration object', () => {
    const service = new JhiConfigService(MANAGERCARE_CONFIG);
    const config = service.getConfig();

    config.defaultI18nLang = 'en';

    expect(service.getConfig()).toBe(config);
    expect(service.getConfig().defaultI18nLang).toBe('en');
  });
});
