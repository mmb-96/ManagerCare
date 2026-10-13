import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { translatePartialLoader } from 'app/shared/jhipster-compat/translate-loader';

describe('Translation loader compatibility', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let originalTimestamp: string | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    originalTimestamp = process.env.BUILD_TIMESTAMP;
    process.env.BUILD_TIMESTAMP = '1700000000123';
  });

  afterEach(() => {
    if (originalTimestamp === undefined) {
      delete process.env.BUILD_TIMESTAMP;
    } else {
      process.env.BUILD_TIMESTAMP = originalTimestamp;
    }
    httpMock.verify();
  });

  it('loads the complete Spanish JSON using the exact historical cache-busting URL', () => {
    const translations = { global: { title: 'ManagerCare' } };
    let received: Object | undefined;

    translatePartialLoader(http)
      .getTranslation('es')
      .subscribe(value => (received = value));

    const request = httpMock.expectOne('i18n/es.json?buildTimestamp=1700000000123');
    expect(request.request.method).toBe('GET');
    request.flush(translations);
    expect(received).toEqual(translations);
  });
});
