import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { SERVER_API_URL } from 'app/app.constants';
import { AuthInterceptor } from 'app/blocks/interceptor/auth.interceptor';
import { resetStorageContractTestBed, storageContractModule } from '../../../helpers/storage-contract';

describe('AuthInterceptor storage contract', () => {
  let interceptor: AuthInterceptor;
  let local: LocalStorageService;
  let session: SessionStorageService;
  let forwarded: HttpRequest<unknown>;
  let handler: HttpHandler;

  beforeEach(() => {
    resetStorageContractTestBed();
    TestBed.configureTestingModule({ imports: [storageContractModule()], providers: [AuthInterceptor] });
    interceptor = TestBed.inject(AuthInterceptor);
    local = TestBed.inject(LocalStorageService);
    session = TestBed.inject(SessionStorageService);
    handler = {
      handle: request => {
        forwarded = request;
        return of(new HttpResponse({ status: 200 }));
      }
    };
  });

  afterEach(() => resetStorageContractTestBed());

  it('adds the local token to a relative URL before considering the session token', () => {
    local.store('authenticationToken', 'local-token');
    session.store('authenticationToken', 'session-token');
    interceptor.intercept(new HttpRequest('GET', 'api/account'), handler).subscribe();
    expect(forwarded.headers.get('Authorization')).toBe('Bearer local-token');
  });

  it('uses the session token when no local token exists', () => {
    session.store('authenticationToken', 'session-token');
    interceptor.intercept(new HttpRequest('GET', 'api/account'), handler).subscribe();
    expect(forwarded.headers.get('Authorization')).toBe('Bearer session-token');
  });

  it('forwards the original request unchanged when no token exists', () => {
    const request = new HttpRequest('GET', 'api/account');
    interceptor.intercept(request, handler).subscribe();
    expect(forwarded).toBe(request);
    expect(forwarded.headers.has('Authorization')).toBe(false);
  });

  it('does not add Authorization to an external absolute URL', () => {
    local.store('authenticationToken', 'local-token');
    expect(SERVER_API_URL || '').toBe('');
    const request = new HttpRequest('GET', 'https://example.invalid/test');
    interceptor.intercept(request, handler).subscribe();
    expect(forwarded).toBe(request);
    expect(forwarded.headers.has('Authorization')).toBe(false);
  });

  it('adds Authorization to a root-relative URL without changing its method or URL', () => {
    local.store('authenticationToken', 'local-token');
    interceptor.intercept(new HttpRequest('GET', '/api/account'), handler).subscribe();
    expect(forwarded.headers.get('Authorization')).toBe('Bearer local-token');
    expect(forwarded.method).toBe('GET');
    expect(forwarded.url).toBe('/api/account');
  });
});
