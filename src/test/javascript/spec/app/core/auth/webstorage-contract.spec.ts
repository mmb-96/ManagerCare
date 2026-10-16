import { TestBed } from '@angular/core/testing';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { resetStorageContractTestBed, storageContractModule } from '../../../helpers/storage-contract';

describe('Public Web Storage compatibility contract', () => {
  beforeEach(() => {
    resetStorageContractTestBed();
    TestBed.configureTestingModule({ imports: [storageContractModule()] });
  });

  afterEach(() => resetStorageContractTestBed());

  it('stores the local token under the lowercase physical key as a JSON string', () => {
    const service = TestBed.inject(LocalStorageService);
    service.store('authenticationToken', 'abc.def.ghi');
    expect(window.localStorage.getItem('jhi-authenticationtoken')).toBe('"abc.def.ghi"');
    expect(window.localStorage.getItem('jhi-authenticationToken')).toBeNull();
    expect(window.sessionStorage.getItem('jhi-authenticationtoken')).toBeNull();
    expect(service.retrieve('authenticationToken')).toBe('abc.def.ghi');
  });

  it('stores the session token with the same physical key and JSON encoding', () => {
    const service = TestBed.inject(SessionStorageService);
    service.store('authenticationToken', 'abc.def.ghi');
    expect(window.sessionStorage.getItem('jhi-authenticationtoken')).toBe('"abc.def.ghi"');
    expect(window.localStorage.getItem('jhi-authenticationtoken')).toBeNull();
    expect(service.retrieve('authenticationToken')).toBe('abc.def.ghi');
  });

  it('stores locale as a JSON string in session storage', () => {
    const service = TestBed.inject(SessionStorageService);
    service.store('locale', 'en');
    expect(window.sessionStorage.getItem('jhi-locale')).toBe('"en"');
    expect(service.retrieve('locale')).toBe('en');
  });

  it('stores previousUrl with its lowercase physical key and JSON encoding', () => {
    const service = TestBed.inject(SessionStorageService);
    service.store('previousUrl', '/protected/example');
    expect(window.sessionStorage.getItem('jhi-previousurl')).toBe('"/protected/example"');
    expect(service.retrieve('previousUrl')).toBe('/protected/example');
  });

  it('reads a local token persisted before the current service was resolved', () => {
    window.localStorage.setItem('jhi-authenticationtoken', '"abc.def.ghi"');
    const service = TestBed.inject(LocalStorageService);
    expect(service.retrieve('authenticationToken')).toBe('abc.def.ghi');
  });

  it('reads a session token persisted before the current service was resolved', () => {
    window.sessionStorage.setItem('jhi-authenticationtoken', '"abc.def.ghi"');
    const service = TestBed.inject(SessionStorageService);
    expect(service.retrieve('authenticationToken')).toBe('abc.def.ghi');
  });

  it('reads pre-existing locale and previousUrl JSON strings', () => {
    window.sessionStorage.setItem('jhi-locale', '"en"');
    window.sessionStorage.setItem('jhi-previousurl', '"/protected/example"');
    const service = TestBed.inject(SessionStorageService);
    expect(service.retrieve('locale')).toBe('en');
    expect(service.retrieve('previousUrl')).toBe('/protected/example');
  });

  it('returns null for a missing key in both stores', () => {
    expect(TestBed.inject(LocalStorageService).retrieve('missingContract')).toBeNull();
    expect(TestBed.inject(SessionStorageService).retrieve('missingContract')).toBeNull();
  });

  it('returns null and warns when a pre-existing value is invalid JSON', () => {
    window.localStorage.setItem('jhi-invalidjson', 'not-json');
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const service = TestBed.inject(LocalStorageService);
      expect(service.retrieve('invalidJson')).toBeNull();
      expect(warning).toHaveBeenCalledTimes(1);
    } finally {
      warning.mockRestore();
    }
  });

  it('clears the physical key and cached value in both stores', () => {
    const services = [TestBed.inject(LocalStorageService), TestBed.inject(SessionStorageService)];
    const stores = [window.localStorage, window.sessionStorage];
    services.forEach((service, index) => {
      service.store('authenticationToken', 'abc.def.ghi');
      service.clear('authenticationToken');
      expect(stores[index].getItem('jhi-authenticationtoken')).toBeNull();
      expect(service.retrieve('authenticationToken')).toBeNull();
    });
  });

  it('does not throw when clearing a missing key', () => {
    expect(() => TestBed.inject(LocalStorageService).clear('missingContract')).not.toThrow();
    expect(() => TestBed.inject(SessionStorageService).clear('missingContract')).not.toThrow();
  });
});
