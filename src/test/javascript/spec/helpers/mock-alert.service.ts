import { JhiAlertService } from 'app/shared/jhipster-compat/alert.service';
import { JhiAlert } from 'app/shared/jhipster-compat/alert.model';

import { SpyObject } from './spyobject';

export class MockAlertService extends SpyObject {
  constructor() {
    super(JhiAlertService);
  }

  addAlert(alertOptions: JhiAlert): JhiAlert {
    return alertOptions;
  }

  isToast(): boolean {
    return false;
  }
}
