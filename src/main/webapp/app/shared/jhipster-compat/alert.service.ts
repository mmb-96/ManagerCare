import { Injectable, Optional, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from 'ng-jhipster';

import { JhiAlert } from './alert.model';

@Injectable({ providedIn: 'root' })
export class JhiAlertService {
  private alertId = 0;
  private readonly alerts: JhiAlert[] = [];
  private readonly timeout: number;
  private readonly toast: boolean;
  private readonly i18nEnabled: boolean;

  constructor(private sanitizer: DomSanitizer, configService: JhiConfigService, @Optional() private translateService: TranslateService) {
    const config = configService.getConfig();
    this.toast = config.alertAsToast as boolean;
    this.i18nEnabled = config.i18nEnabled as boolean;
    this.timeout = config.alertTimeout as number;
  }

  clear(): void {
    this.alerts.splice(0, this.alerts.length);
  }

  get(): JhiAlert[] {
    return this.alerts;
  }

  success(msg: string, params?: any, position?: string): JhiAlert {
    return this.addAlert({ type: 'success', msg, params, timeout: this.timeout, toast: this.isToast(), position }, []);
  }

  error(msg: string, params?: any, position?: string): JhiAlert {
    return this.addAlert({ type: 'danger', msg, params, timeout: this.timeout, toast: this.isToast(), position }, []);
  }

  warning(msg: string, params?: any, position?: string): JhiAlert {
    return this.addAlert({ type: 'warning', msg, params, timeout: this.timeout, toast: this.isToast(), position }, []);
  }

  info(msg: string, params?: any, position?: string): JhiAlert {
    return this.addAlert({ type: 'info', msg, params, timeout: this.timeout, toast: this.isToast(), position }, []);
  }

  addAlert(alertOptions: JhiAlert, extAlerts: JhiAlert[]): JhiAlert {
    alertOptions.id = this.alertId++;
    if (this.i18nEnabled && alertOptions.msg) {
      alertOptions.msg = this.translateService.instant(alertOptions.msg, alertOptions.params);
    }

    const alert = this.factory(alertOptions);
    if (alertOptions.timeout && alertOptions.timeout > 0) {
      setTimeout(() => this.closeAlert(alertOptions.id!, extAlerts), alertOptions.timeout);
    }
    return alert;
  }

  closeAlert(id: number, extAlerts?: JhiAlert[]): JhiAlert[] {
    const alerts = extAlerts && extAlerts.length > 0 ? extAlerts : this.alerts;
    return this.closeAlertByIndex(alerts.map(alert => alert.id).indexOf(id), alerts);
  }

  closeAlertByIndex(index: number, alerts: JhiAlert[]): JhiAlert[] {
    return alerts.splice(index, 1);
  }

  isToast(): boolean {
    return this.toast;
  }

  private factory(alertOptions: JhiAlert): JhiAlert {
    const alert: JhiAlert = {
      type: alertOptions.type,
      msg: this.sanitizer.sanitize(SecurityContext.HTML, alertOptions.msg)!,
      id: alertOptions.id,
      timeout: alertOptions.timeout,
      toast: alertOptions.toast,
      position: alertOptions.position ? alertOptions.position : 'top right',
      scoped: alertOptions.scoped,
      close: alerts => this.closeAlert(alertOptions.id!, alerts)
    };
    if (!alert.scoped) {
      this.alerts.push(alert);
    }
    return alert;
  }
}
