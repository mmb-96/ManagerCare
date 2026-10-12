import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { NotificationInterceptor } from 'app/blocks/interceptor/notification.interceptor';
import { JhiAlertService } from 'app/shared/jhipster-compat/alert.service';

describe('NotificationInterceptor', () => {
  it('preserves the alert translation key and decoded response-header parameter', () => {
    const alertService: any = { success: jasmine.createSpy('success') };
    const interceptor = new NotificationInterceptor(alertService);
    const response = new HttpResponse({
      headers: new HttpHeaders({
        'X-managerCareApp-alert': 'managerCareApp.tipo.created',
        'X-managerCareApp-params': 'valor+con%20espacio'
      })
    });

    interceptor.intercept(new HttpRequest('POST', '/api/tipos', null), { handle: () => of(response) } as any).subscribe();

    expect(alertService.success).toHaveBeenCalledWith('managerCareApp.tipo.created', { param: 'valor con espacio' });
  });
});
