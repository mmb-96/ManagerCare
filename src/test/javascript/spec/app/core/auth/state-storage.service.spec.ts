import { TestBed } from '@angular/core/testing';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { resetStorageContractTestBed, storageContractModule } from '../../../helpers/storage-contract';

describe('StateStorageService storage contract', () => {
  let service: StateStorageService;

  beforeEach(() => {
    resetStorageContractTestBed();
    TestBed.configureTestingModule({ imports: [storageContractModule()] });
    service = TestBed.inject(StateStorageService);
  });

  afterEach(() => resetStorageContractTestBed());

  it('round-trips previousUrl using the historical physical key and JSON string', () => {
    service.storeUrl('/protected/example');
    expect(service.getUrl()).toBe('/protected/example');
    expect(window.sessionStorage.getItem('jhi-previousurl')).toBe('"/protected/example"');
    expect(window.localStorage.getItem('jhi-previousurl')).toBeNull();
  });

  it('clears the stored URL from native storage and subsequent reads', () => {
    service.storeUrl('/protected/example');
    service.clearUrl();
    expect(service.getUrl()).toBeNull();
    expect(window.sessionStorage.getItem('jhi-previousurl')).toBeNull();
  });

  it('returns null when no previousUrl was stored', () => {
    expect(service.getUrl()).toBeNull();
  });
});
