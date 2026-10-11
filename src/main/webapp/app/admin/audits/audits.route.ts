import { Route } from '@angular/router';
import { ResolvePagingParams } from 'app/shared/util/resolve-paging-params.service';

import { AuditsComponent } from './audits.component';

export const auditsRoute: Route = {
  path: '',
  component: AuditsComponent,
  resolve: {
    pagingParams: ResolvePagingParams
  },
  data: {
    pageTitle: 'audits.title',
    defaultSort: 'auditEventDate,desc'
  }
};
