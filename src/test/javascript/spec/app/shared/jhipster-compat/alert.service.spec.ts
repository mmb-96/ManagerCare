import { DomSanitizer } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from 'ng-jhipster';

import { JhiAlertService } from 'app/shared/jhipster-compat/alert.service';
import { JhiAlert } from 'app/shared/jhipster-compat/alert.model';

describe('JhiAlertService compatibility', () => {
  let service: JhiAlertService;
  let translate: any;

  beforeEach(() => {
    translate = {
      instant: jasmine.createSpy('instant').and.callFake((key: string, params?: any) => (params ? `${key}:${params.param}` : key))
    };
    service = new JhiAlertService(
      { sanitize: (_context: any, value: string) => value } as DomSanitizer,
      { getConfig: () => ({ alertAsToast: false, alertTimeout: 50, i18nEnabled: true }) } as JhiConfigService,
      translate
    );
  });

  it('keeps the mutable global collection and creates translated success alerts in order', () => {
    const alerts = service.get();

    const first = service.success('managerCareApp.created', { param: 'alpha' });
    const second = service.error('managerCareApp.failed');

    expect(service.get()).toBe(alerts);
    expect(alerts).toEqual([first, second]);
    expect(first.id).toBe(0);
    expect(first.type).toBe('success');
    expect(first.msg).toBe('managerCareApp.created:alpha');
    expect(first.timeout).toBe(50);
    expect(first.toast).toBe(false);
    expect(first.position).toBe('top right');
    expect(first.params).toBeUndefined();
    expect(second.id).toBe(1);
    expect(second.type).toBe('danger');
    expect(second.msg).toBe('managerCareApp.failed');
    expect(translate.instant).toHaveBeenCalledWith('managerCareApp.created', { param: 'alpha' });
  });

  it('auto-dismisses global alerts after their configured timeout', fakeAsync(() => {
    service.info('first');
    service.warning('second');

    tick(50);

    expect(service.get()).toEqual([]);
  }));

  it('keeps scoped alerts outside the global collection and closes them through their callback', () => {
    const scopedAlerts: JhiAlert[] = [];
    const scoped = service.addAlert({ type: 'danger', msg: 'scoped', timeout: 0, scoped: true, toast: false }, scopedAlerts);
    scopedAlerts.push(scoped);

    expect(service.get()).toEqual([]);
    expect(scopedAlerts).toEqual([scoped]);

    scoped.close!(scopedAlerts);

    expect(scopedAlerts).toEqual([]);
  });

  it('clears the existing global collection without replacing it', () => {
    const alerts = service.get();
    service.success('managerCareApp.created');

    service.clear();

    expect(service.get()).toBe(alerts);
    expect(alerts).toEqual([]);
  });
});
