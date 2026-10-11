# Stage 8I1 — local pagination compatibility

## Scope

Stage 8I1 removes the only active `ng-jhipster` pagination resolver dependency
from User management and Audits. It does not remove `ng-jhipster`, alter its
package dependency, or change visual exports from `NgJhipsterModule`.

## Base

`550bdda7f388007631fc1a73b42514011f790f61`

## Previous ng-jhipster dependency

The investigation found two active consumers of `JhiResolvePagingParams`:

- `src/main/webapp/app/admin/user-management/user-management.route.ts`
- `src/main/webapp/app/admin/audits/audits.route.ts`

There were no direct active consumers of `JhiPaginationUtil` in product or test
code.

## Local replacement

The local compatibility implementation is intentionally small:

- `src/main/webapp/app/shared/util/pagination-util.ts` provides the historical
  parsing semantics for `page`, `predicate`, and `ascending`.
- `src/main/webapp/app/shared/util/resolve-paging-params.service.ts` implements
  the Angular 15 `Resolve<PagingParams>` contract from an
  `ActivatedRouteSnapshot`.

`ResolvePagingParams` returns a `PagingParams` object with `page`, `predicate`,
and `ascending`. It applies the route `defaultSort` when `sort` is absent and
falls back to `id,asc` when the route does not define one.

The retained behaviour is:

| Contract | Behaviour |
| --- | --- |
| Router page | 1-based |
| Backend page | `page - 1` in the existing components |
| Users default sort | `id,asc` |
| Audits default sort | `auditEventDate,desc` |
| Supported sort forms | `sort=id,asc` and `sort=id%2Casc` |
| Parsing | historical `parseInt()`, predicate extraction, and ascending/descending handling |

## Consumers migrated

### User management

`src/main/webapp/app/admin/user-management/user-management.route.ts` now uses
`ResolvePagingParams` instead of `JhiResolvePagingParams`. The route,
authorities, page title, `defaultSort`, query parameters, navigation, and
component behaviour remain unchanged.

### Audits

`src/main/webapp/app/admin/audits/audits.route.ts` now uses
`ResolvePagingParams` instead of `JhiResolvePagingParams`. The route, default
sort, page handling, query parameters, date filters, and visual behaviour
remain unchanged.

## Residual imports

| Symbol | Active consumers |
| --- | ---: |
| `JhiResolvePagingParams` | 0 |
| `JhiPaginationUtil` | 0 |

## Automated tests

The previous frontend baseline was 60 suites and 181 tests. Stage 8I1 finishes
with 62 suites and 189 tests, with zero failures. The delta is two suites and
eight tests in:

- `pagination-util.spec.ts`
- `resolve-paging-params.service.spec.ts`

Focused coverage for the local utilities plus the two migrated component areas
was 4 suites and 24 tests, all green.

## Technical gates

| Gate | Result |
| --- | --- |
| Focused Jest | 4 suites / 24 tests / green |
| Full Jest | 62 suites / 189 tests / 0 failures |
| `ngc` | 0 diagnostics |
| Webpack production | green |
| Production artifacts | 73 |
| Webpack DEV application smoke | green |
| Static production references | 0 missing |

Non-blocking historical warnings remain: deprecated Jest `testURL`
configuration, the `ts-jest` `esModuleInterop` recommendation, outdated
`caniuse-lite`, the `DefinePlugin` `process.env.NODE_ENV` warning, and Babel
deoptimisation messages for large dependencies.

## Runtime validation

An isolated PostgreSQL 17.11 environment was used with Java 21 and Spring Boot
3.5.9. The automatic prechecks confirmed:

- health returned `200 / UP`;
- synthetic login returned `200` and a JWT;
- `/api/users` returned 22 users over pages of 20 and 2, with a `Link` header;
- ascending and descending sort requests and the second users page returned
  `200`;
- `/management/audits` returned 29 events over pages of 20 and 9, with a
  `Link` header;
- the `2026-09-10` through `2026-09-20` audit filter returned 11 events.

No temporary credentials are recorded here.

## Manual acceptance

The authenticated SPA validation passed:

| Area | Result |
| --- | --- |
| User management U1-U6 | PASS |
| Audits A1-A4 | PASS |
| Audits A5 | NOT APPLICABLE — NO ADDITIONAL SORT CONTROL EXERCISED |
| Audits A6-A7 | PASS |
| Console and network N | PASS |

This covers initial load, default sort, paging, return to page one, available
sort controls, query parameters, reload/state reconstruction, and audit date
filters. The historical Audits native date inputs debt is separate, out of
scope, and non-blocking.

## Remaining ng-jhipster dependency

`ng-jhipster` 0.12.0 remains installed. `NgJhipsterModule` is unchanged, as
are `JhiEventManager`, `JhiAlertService`, `JhiLanguageService`, translation,
visual exports, sort directives, `jhi-item-count`, `jhi-boolean`, pipes, and
the package dependency itself.

## Remaining Angular 16 blockers

- `@fortawesome/angular-fontawesome` 0.6.0
- `@ngx-translate/core` 11.0.1
- `@ngx-translate/http-loader` 4.0.0
- `ngx-cookie` 4.0.2
- `ngx-infinite-scroll` 8.0.1
- `ngx-webstorage` 5.0.0

## Deferred

- F-B legacy ESLint
- H2 Health SSL translation
- Audits native date inputs
- Protractor/ChromeDriver
- Node modernization
- Angular 16

## Conclusion

**8I1 LOCAL PAGINATION DECOUPLING GREEN**
