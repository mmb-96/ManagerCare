import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translatePartialLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'i18n/', `.json?buildTimestamp=${process.env.BUILD_TIMESTAMP}`);
}
