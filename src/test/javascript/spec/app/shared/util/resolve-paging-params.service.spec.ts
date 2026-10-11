import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { PaginationUtil } from 'app/shared/util/pagination-util';
import { ResolvePagingParams } from 'app/shared/util/resolve-paging-params.service';

describe('ResolvePagingParams', () => {
  const resolver = new ResolvePagingParams(new PaginationUtil());
  const state = {} as RouterStateSnapshot;

  it('should resolve present page and ascending sort parameters', () => {
    const route = ({
      queryParams: { page: '3', sort: 'login,asc' },
      data: { defaultSort: 'id,asc' }
    } as unknown) as ActivatedRouteSnapshot;

    expect(resolver.resolve(route, state)).toEqual({ page: 3, predicate: 'login', ascending: true });
  });

  it('should resolve present page and descending sort parameters', () => {
    const route = ({
      queryParams: { page: '4', sort: 'auditEventDate,desc' },
      data: { defaultSort: 'auditEventDate,desc' }
    } as unknown) as ActivatedRouteSnapshot;

    expect(resolver.resolve(route, state)).toEqual({ page: 4, predicate: 'auditEventDate', ascending: false });
  });

  it('should use the route default sort and first page when parameters are absent', () => {
    const route = ({ queryParams: {}, data: { defaultSort: 'auditEventDate,desc' } } as unknown) as ActivatedRouteSnapshot;

    expect(resolver.resolve(route, state)).toEqual({ page: 1, predicate: 'auditEventDate', ascending: false });
  });

  it('should use the global default sort when the route default is absent', () => {
    const route = ({ queryParams: {}, data: {} } as unknown) as ActivatedRouteSnapshot;

    expect(resolver.resolve(route, state)).toEqual({ page: 1, predicate: 'id', ascending: true });
  });
});
