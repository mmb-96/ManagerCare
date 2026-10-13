import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService } from 'app/shared/jhipster-compat/alert.service';
import { JhiEventManager } from 'app/shared/jhipster-compat/event-manager.service';
import { JhiLanguageService } from 'app/shared/jhipster-compat/language.service';

import { MockLanguageService } from './helpers/mock-language.service';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { MockAccountService } from './helpers/mock-account.service';
import { MockActivatedRoute, MockRouter } from './helpers/mock-route.service';
import { MockActiveModal } from './helpers/mock-active-modal.service';
import { MockEventManager } from './helpers/mock-event-manager.service';

@NgModule({
  providers: [
    DatePipe,
    {
      provide: JhiLanguageService,
      useClass: MockLanguageService
    },
    {
      provide: JhiEventManager,
      useClass: MockEventManager
    },
    {
      provide: NgbActiveModal,
      useClass: MockActiveModal
    },
    {
      provide: ActivatedRoute,
      useValue: new MockActivatedRoute({ id: 123 })
    },
    {
      provide: Router,
      useClass: MockRouter
    },
    {
      provide: AccountService,
      useClass: MockAccountService
    },
    {
      provide: LoginModalService,
      useValue: null
    },
    {
      provide: JhiAlertService,
      useValue: null
    },
    {
      provide: NgbModal,
      useValue: null
    }
  ],
  imports: [HttpClientTestingModule]
})
export class ManagerCareTestModule {}
