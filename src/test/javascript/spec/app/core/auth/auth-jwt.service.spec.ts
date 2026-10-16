import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { SERVER_API_URL } from 'app/app.constants';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { resetStorageContractTestBed, storageContractModule } from '../../../helpers/storage-contract';

describe('AuthServerProvider storage contract', () => {
  let service: AuthServerProvider;
  let local: LocalStorageService;
  let session: SessionStorageService;
  let http: HttpTestingController;

  beforeEach(() => {
    resetStorageContractTestBed();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, storageContractModule()] });
    service = TestBed.inject(AuthServerProvider);
    local = TestBed.inject(LocalStorageService);
    session = TestBed.inject(SessionStorageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      http.verify();
    } finally {
      resetStorageContractTestBed();
    }
  });

  it('writes remember-me login to local storage without clearing the session token', () => {
    session.store('authenticationToken', 'old-session-token');
    service.login({ username: 'synthetic-user', password: 'synthetic-only', rememberMe: true }).subscribe();
    const request = http.expectOne(SERVER_API_URL + 'api/authenticate');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.rememberMe).toBe(true);
    request.flush({ id_token: 'local-token' });
    expect(local.retrieve('authenticationToken')).toBe('local-token');
    expect(session.retrieve('authenticationToken')).toBe('old-session-token');
    expect(window.localStorage.getItem('jhi-authenticationtoken')).toBe('"local-token"');
  });

  it('writes non-remember-me login to session storage without clearing the local token', () => {
    local.store('authenticationToken', 'old-local-token');
    service.login({ username: 'synthetic-user', password: 'synthetic-only', rememberMe: false }).subscribe();
    const request = http.expectOne(SERVER_API_URL + 'api/authenticate');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.rememberMe).toBe(false);
    request.flush({ id_token: 'session-token' });
    expect(session.retrieve('authenticationToken')).toBe('session-token');
    expect(local.retrieve('authenticationToken')).toBe('old-local-token');
    expect(window.sessionStorage.getItem('jhi-authenticationtoken')).toBe('"session-token"');
  });

  it('prefers the local token when both stores contain one', () => {
    local.store('authenticationToken', 'local-token');
    session.store('authenticationToken', 'session-token');
    expect(service.getToken()).toBe('local-token');
  });

  it('falls back to the session token when local storage has no token', () => {
    session.store('authenticationToken', 'session-token');
    expect(service.getToken()).toBe('session-token');
  });

  it('returns the empty string when neither store contains a token', () => {
    expect(service.getToken()).toBe('');
  });

  it('only clears both tokens when the logout Observable is subscribed and completes', () => {
    local.store('authenticationToken', 'local-token');
    session.store('authenticationToken', 'session-token');
    const logout$ = service.logout();
    expect(local.retrieve('authenticationToken')).toBe('local-token');
    expect(session.retrieve('authenticationToken')).toBe('session-token');
    let completed = false;
    logout$.subscribe({ complete: () => (completed = true) });
    expect(completed).toBe(true);
    expect(local.retrieve('authenticationToken')).toBeNull();
    expect(session.retrieve('authenticationToken')).toBeNull();
    expect(window.localStorage.getItem('jhi-authenticationtoken')).toBeNull();
    expect(window.sessionStorage.getItem('jhi-authenticationtoken')).toBeNull();
  });
});
