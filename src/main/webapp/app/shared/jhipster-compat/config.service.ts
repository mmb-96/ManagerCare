import { Inject, Injectable, InjectionToken } from '@angular/core';

import { JhiCompatConfig } from './config.model';

export const JHI_COMPAT_CONFIG = new InjectionToken<JhiCompatConfig>('JHI_COMPAT_CONFIG');

@Injectable({ providedIn: 'root' })
export class JhiConfigService {
  private readonly config: JhiCompatConfig;

  constructor(@Inject(JHI_COMPAT_CONFIG) initialConfig: JhiCompatConfig) {
    this.config = { ...initialConfig };
  }

  getConfig(): JhiCompatConfig {
    return this.config;
  }
}
