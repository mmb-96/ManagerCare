import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

import { JhiConfigService } from './config.service';

export class JhiMissingTranslationHandler implements MissingTranslationHandler {
  constructor(private configService: JhiConfigService) {}

  handle(params: MissingTranslationHandlerParams): string {
    return `${this.configService.getConfig().noi18nMessage}[${params.key}]`;
  }
}

export function missingTranslationHandler(configService: JhiConfigService): JhiMissingTranslationHandler {
  return new JhiMissingTranslationHandler(configService);
}
