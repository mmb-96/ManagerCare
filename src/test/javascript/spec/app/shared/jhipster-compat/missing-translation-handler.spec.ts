import { TranslateService } from '@ngx-translate/core';

import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';
import { JhiConfigService } from 'app/shared/jhipster-compat/config.service';
import { missingTranslationHandler, JhiMissingTranslationHandler } from 'app/shared/jhipster-compat/missing-translation-handler';

describe('Missing translation handler compatibility', () => {
  let config: JhiConfigService;
  let handler: JhiMissingTranslationHandler;
  const translateService = {} as TranslateService;

  beforeEach(() => {
    config = new JhiConfigService(MANAGERCARE_CONFIG);
    handler = missingTranslationHandler(config);
  });

  it('preserves the exact marker for a missing key', () => {
    expect(handler.handle({ key: 'foo.bar', translateService })).toBe('translation-not-found[foo.bar]');
  });

  it('preserves the historical SSL health marker', () => {
    expect(handler.handle({ key: 'health.indicators.ssl', translateService })).toBe('translation-not-found[health.indicators.ssl]');
  });

  it('reads the current local configuration without conditioning on i18nEnabled', () => {
    config.getConfig().noi18nMessage = 'custom-marker';
    config.getConfig().i18nEnabled = false;
    expect(handler.handle({ key: 'foo.bar', translateService })).toBe('custom-marker[foo.bar]');
  });

  it('preserves interpolation when the configured message is empty', () => {
    config.getConfig().noi18nMessage = '';
    expect(handler.handle({ key: 'foo.bar', translateService })).toBe('[foo.bar]');
  });

  it('preserves legacy interpolation if a null message reaches the handler at runtime', () => {
    config.getConfig().noi18nMessage = (null as unknown) as string;
    expect(handler.handle({ key: 'foo.bar', translateService })).toBe('null[foo.bar]');
  });
});
