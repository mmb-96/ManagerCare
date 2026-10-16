import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
import { LoginService } from 'app/core/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { JhiLanguageService } from 'app/shared/jhipster-compat/language.service';
import { resetStorageContractTestBed, storageContractModule } from '../../../helpers/storage-contract';

describe('Navbar locale storage contract', () => {
  beforeEach(() => {
    resetStorageContractTestBed();
    TestBed.configureTestingModule({
      imports: [storageContractModule()],
      providers: [
        NavbarComponent,
        { provide: LoginService, useValue: {} },
        { provide: AccountService, useValue: {} },
        { provide: LoginModalService, useValue: {} },
        { provide: ProfileService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: JhiLanguageService, useValue: { changeLanguage: jest.fn() } }
      ]
    });
  });

  afterEach(() => resetStorageContractTestBed());

  it('writes locale only to session storage and invokes the language service', () => {
    const component = TestBed.inject(NavbarComponent);
    component.changeLanguage('en');
    expect(TestBed.inject(SessionStorageService).retrieve('locale')).toBe('en');
    expect(window.sessionStorage.getItem('jhi-locale')).toBe('"en"');
    expect(window.localStorage.getItem('jhi-locale')).toBeNull();
    expect(TestBed.inject(JhiLanguageService).changeLanguage).toHaveBeenCalledWith('en');
  });
});
