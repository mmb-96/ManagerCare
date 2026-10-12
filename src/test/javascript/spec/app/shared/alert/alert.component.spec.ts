import { AlertComponent } from 'app/shared/alert/alert.component';
import { JhiAlertService } from 'app/shared/jhipster-compat/alert.service';
import { JhiAlert } from 'app/shared/jhipster-compat/alert.model';

describe('AlertComponent', () => {
  it('uses the service collection and clears it when destroyed', () => {
    const alerts: JhiAlert[] = [{ type: 'success', msg: 'created' }];
    const alertService: any = {
      get: jasmine.createSpy('get').and.returnValue(alerts),
      clear: jasmine.createSpy('clear')
    };
    const component = new AlertComponent(alertService);

    component.ngOnInit();
    component.ngOnDestroy();

    expect(component.alerts).toBe(alerts);
    expect(alertService.clear).toHaveBeenCalled();
  });

  it('keeps toast and position classes', () => {
    const component = new AlertComponent({} as JhiAlertService);

    expect(component.setClasses({ type: 'info', msg: 'message', toast: true, position: 'bottom left' })).toEqual({
      'jhi-toast': true,
      'bottom left': true
    });
  });
});
