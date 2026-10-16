import { TestBed } from '@angular/core/testing';
import { LocalStorageService, NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';

const logicalKeys = ['authenticationToken', 'locale', 'previousUrl', 'invalidJson', 'missingContract'];

export function storageContractModule(): ReturnType<typeof NgxWebstorageModule.forRoot> {
  return NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' });
}

export function resetStorageContractTestBed(): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [storageContractModule()] });
  try {
    // Public services clear cached values as well as the exact native keys.
    const local = TestBed.inject(LocalStorageService);
    const session = TestBed.inject(SessionStorageService);
    logicalKeys.forEach(key => {
      local.clear(key);
      session.clear(key);
    });
    [window.localStorage, window.sessionStorage].forEach(storage => {
      logicalKeys.forEach(key => storage.removeItem('jhi-' + key.toLowerCase()));
      storage.removeItem('jhi-authenticationToken');
    });
  } finally {
    // Raw fixtures in a test are seeded before resolving its fresh services.
    TestBed.resetTestingModule();
  }
}
