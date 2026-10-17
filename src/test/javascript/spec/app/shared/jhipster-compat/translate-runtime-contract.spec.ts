import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { MANAGERCARE_CONFIG } from 'app/shared/jhipster-compat/config.model';
import { JHI_COMPAT_CONFIG, JhiConfigService } from 'app/shared/jhipster-compat/config.service';
import { JhiLanguageService } from 'app/shared/jhipster-compat/language.service';
import { missingTranslationHandler, JhiMissingTranslationHandler } from 'app/shared/jhipster-compat/missing-translation-handler';
import { translatePartialLoader } from 'app/shared/jhipster-compat/translate-loader';
import { JhiTranslateDirective } from 'app/shared/jhipster-compat/template/translate.directive';

@Component({
  template: `
    <span id="directive" jhiTranslate="contract.hello"></span>
    <span id="greeting" jhiTranslate="contract.greeting" [translateValues]="{ name: 'Manuel' }"></span>
    <span id="static-pipe">{{ 'contract.hello' | translate }}</span>
    <span id="dynamic-pipe">{{ translationKey | translate }}</span>
  `
})
class TranslationContractHost {
  translationKey = 'contract.hello';
}

describe('Translation runtime contracts', () => {
  const timestamp = '1234567890';
  const spanish = {
    contract: { hello: 'Hola', greeting: 'Hola {{name}}', other: 'Otro texto', fallback: 'Solo en español', alert: 'Error {{field}}' }
  };
  const synthetic = { contract: { hello: 'Synthetic hello', greeting: 'Synthetic {{name}}', other: 'Synthetic other' } };
  let originalTimestamp: string | undefined;
  let http: HttpTestingController;
  let translate: TranslateService;
  let language: JhiLanguageService;
  let config: JhiConfigService;
  let fixture: ComponentFixture<TranslationContractHost> | undefined;

  beforeEach(() => {
    originalTimestamp = process.env.BUILD_TIMESTAMP;
    process.env.BUILD_TIMESTAMP = timestamp;
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useFactory: translatePartialLoader, deps: [HttpClient] },
          missingTranslationHandler: { provide: MissingTranslationHandler, useFactory: missingTranslationHandler, deps: [JhiConfigService] }
        })
      ],
      declarations: [TranslationContractHost, JhiTranslateDirective],
      providers: [{ provide: JHI_COMPAT_CONFIG, useValue: { ...MANAGERCARE_CONFIG } }]
    });
    http = TestBed.inject(HttpTestingController);
    translate = TestBed.inject(TranslateService);
    language = TestBed.inject(JhiLanguageService);
    config = TestBed.inject(JhiConfigService);
  });

  afterEach(() => {
    try {
      if (fixture) {
        fixture.destroy();
        fixture = undefined;
      }
      http.verify();
    } finally {
      TestBed.resetTestingModule();
      if (originalTimestamp === undefined) {
        delete process.env.BUILD_TIMESTAMP;
      } else {
        process.env.BUILD_TIMESTAMP = originalTimestamp;
      }
    }
  });

  function flushLanguage(lang: string, translations: object): void {
    const request = http.expectOne(`i18n/${lang}.json?buildTimestamp=${timestamp}`);
    expect(request.request.method).toBe('GET');
    request.flush(translations);
  }

  function initialize(): void {
    language.init();
    flushLanguage('es', spanish);
  }

  function createHost(): void {
    fixture = TestBed.createComponent(TranslationContractHost);
    fixture.detectChanges();
  }

  function text(selector: string): string {
    return fixture!.nativeElement.querySelector(selector).textContent;
  }

  it('resolves the real translation dependency graph with the local factories', () => {
    expect(translate).toBeInstanceOf(TranslateService);
    expect(TestBed.inject(TranslateLoader)).toBeDefined();
    expect(TestBed.inject(MissingTranslationHandler)).toBeInstanceOf(JhiMissingTranslationHandler);
    expect(language).toBeInstanceOf(JhiLanguageService);
    expect(config.getConfig().defaultI18nLang).toBe('es');
    expect(config.getConfig()).not.toBe(MANAGERCARE_CONFIG);
  });

  it('requests the exact configured URL and delivers the HTTP response through the service', () => {
    let received: string | undefined;
    const load = translate.use('es').subscribe();
    const result = translate.get('contract.hello').subscribe(value => (received = value));
    expect(received).toBeUndefined();
    flushLanguage('es', spanish);
    expect(received).toBe('Hola');
    result.unsubscribe();
    load.unsubscribe();
  });

  it('initializes the real default and current language and loads its translations', () => {
    initialize();
    expect(language.getCurrentLanguage()).toBe('es');
    expect(translate.getDefaultLang()).toBe('es');
    expect(translate.currentLang).toBe('es');
    expect(translate.instant('contract.hello')).toBe('Hola');
  });

  it('changes the local configuration and real language and notifies consumers', () => {
    initialize();
    const received: string[] = [];
    const events = translate.onLangChange.subscribe(event => received.push(event.lang));
    try {
      language.changeLanguage('zz');
      expect(language.getCurrentLanguage()).toBe('zz');
      expect(config.getConfig().defaultI18nLang).toBe('zz');
      expect(MANAGERCARE_CONFIG.defaultI18nLang).toBe('es');
      flushLanguage('zz', synthetic);
      expect(translate.currentLang).toBe('zz');
      expect(translate.instant('contract.hello')).toBe('Synthetic hello');
      expect(received).toEqual(['zz']);
    } finally {
      events.unsubscribe();
    }
  });

  it('preserves the exact missing translation marker through the real service', () => {
    initialize();
    let received: string | undefined;
    const result = translate.get('missing.contract.key').subscribe(value => (received = value));
    expect(received).toBe('translation-not-found[missing.contract.key]');
    result.unsubscribe();
  });

  it('uses the default language before the missing translation handler', () => {
    initialize();
    language.changeLanguage('zz');
    flushLanguage('zz', synthetic);
    expect(translate.getDefaultLang()).toBe('es');
    expect(translate.currentLang).toBe('zz');
    expect(translate.instant('contract.fallback')).toBe('Solo en español');
    expect(translate.instant('missing.contract.key')).toBe('translation-not-found[missing.contract.key]');
  });

  it('renders a known jhiTranslate key and interpolates its values using the real service', () => {
    initialize();
    createHost();
    expect(text('#directive')).toBe('Hola');
    expect(text('#greeting')).toBe('Hola Manuel');
  });

  it('refreshes the real directive and pipes together without recreating the host', () => {
    initialize();
    createHost();
    const originalHost = fixture;
    expect(text('#directive')).toBe('Hola');
    expect(text('#static-pipe')).toBe('Hola');
    expect(text('#dynamic-pipe')).toBe('Hola');
    language.changeLanguage('zz');
    flushLanguage('zz', synthetic);
    fixture!.detectChanges();
    expect(fixture).toBe(originalHost);
    expect(text('#directive')).toBe('Synthetic hello');
    expect(text('#greeting')).toBe('Synthetic Manuel');
    expect(text('#static-pipe')).toBe('Synthetic hello');
    expect(text('#dynamic-pipe')).toBe('Synthetic hello');
  });

  it('renders static and dynamic keys with the real translate pipe', () => {
    initialize();
    createHost();
    expect(text('#static-pipe')).toBe('Hola');
    expect(text('#dynamic-pipe')).toBe('Hola');
    fixture!.componentInstance.translationKey = 'contract.other';
    fixture!.detectChanges();
    expect(text('#dynamic-pipe')).toBe('Otro texto');
    expect(text('#static-pipe')).toBe('Hola');
  });

  it('interpolates alert parameters synchronously after loading translations', () => {
    initialize();
    expect(translate.instant('contract.alert', { field: 'name' })).toBe('Error name');
  });

  it('shares one HTTP request between concurrent subscribers to the same language load', () => {
    const received: string[] = [];
    const loading = translate.use('es');
    const first = loading.subscribe(value => received.push(value.contract.hello));
    const second = loading.subscribe(value => received.push(value.contract.hello));
    try {
      const requests = http.match(`i18n/es.json?buildTimestamp=${timestamp}`);
      expect(requests.length).toBe(1);
      expect(requests[0].request.method).toBe('GET');
      requests[0].flush(spanish);
      expect(received).toEqual(['Hola', 'Hola']);
      http.expectNone(`i18n/es.json?buildTimestamp=${timestamp}`);
    } finally {
      first.unsubscribe();
      second.unsubscribe();
    }
  });
});
