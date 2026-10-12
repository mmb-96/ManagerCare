# Stage 8I2 — local event compatibility

## Scope

This stage decouples the frontend consumers of `JhiEventManager` and
`JhiEventWithContent` from `ng-jhipster`. It does not redesign the event
model, migrate alerts, remove `ng-jhipster`, or update frontend dependencies.

Base: `3cfe6da7959cda2956e6f32a04b69dfcb1386733`.

## Previous dependency and local implementation

The following local compatibility types replace the two event symbols at their
consumers:

- `src/main/webapp/app/shared/jhipster-compat/event-manager.service.ts`
- `src/main/webapp/app/shared/jhipster-compat/event-with-content.model.ts`

The implementation uses existing RxJS only; no external dependency was added.
`JhiEventManager` is provided through `providedIn: 'root'`, so it retains one
shared instance. Its compatible API preserves `broadcast`, `subscribe`, and
`destroy` with name filtering, synchronous delivery, full event-object and
unchanged `content` delivery, multiple subscribers, and
`destroy(subscription)` through `unsubscribe()`.

No event names, payloads, publishers, subscribers, callback behavior, or
lifecycle semantics were redesigned. This stage introduces no NgRx, signals,
new event framework, global event constants, or bulk renames.

## Original inventory and residual imports

| Symbol | Original production consumers | Original test consumers | Residual imports from `ng-jhipster` |
| --- | ---: | ---: | ---: |
| `JhiEventManager` | 20 | 11 | 0 |
| `JhiEventWithContent` | 2 | 1 | 0 |

`ng-jhipster` remains installed. `NgJhipsterModule` is unchanged.

## Preserved event graph

| Event | Publisher | Subscriber | Payload |
| --- | --- | --- | --- |
| `managerCareApp.httpError` | `ErrorHandlerInterceptor` | `AlertErrorComponent` | `JhiEventWithContent<HttpErrorResponse>` |
| `managerCareApp.error` | no current publisher | `AlertErrorComponent` | `JhiEventWithContent<AlertError>` |
| `userListModification` | user delete dialog | `UserManagementComponent` | string |
| `categoriaListModification` | delete dialog | `CategoriaComponent` | string |
| `categoriaAscListModification` | delete dialog | `CategoriaAscComponent` | string |
| `objetivoListModification` | delete dialog | `ObjetivoComponent` / `ObjetivoUserComponent` | string |
| `userExtraListModification` | delete dialog | `UserExtraComponent` / `UserTeamsComponent` | string |
| `tipoListModification` | delete dialog | `TipoComponent` | string |
| `puntosConseguidosListModification` | delete dialog | `PuntosConseguidosComponent` | string |
| `objetivosConseguidosListModification` | delete dialog | `ObjetivosConseguidosComponent` | string |

`managerCareApp.error` has a historical subscriber in `AlertErrorComponent`
but no current publisher. It is retained: its removal requires a dedicated
future investigation and is outside this stage.

## Automated tests

| Suite | Result |
| --- | --- |
| Baseline after 8I1 | 62 suites / 189 tests / 0 failures |
| 8I2 focused tests | 11 suites / 29 tests / 0 failures |
| 8I2 full Jest | 63 suites / 195 tests / 0 failures |

The local tests cover string events, event-with-content delivery, name
isolation, multiple subscribers, synchronous behavior, and destroy/unsubscribe.
`TipoComponent` additionally proves that `tipoListModification` invokes a real
list reload.

## Technical gates

| Gate | Result |
| --- | --- |
| `ngc` | 0 diagnostics |
| Jest focused | 11 suites / 29 tests / 0 failures |
| Jest full | 63 suites / 195 tests / 0 failures |
| Webpack production | GREEN |
| Production artifacts | 73 |
| Static references, Workbox, i18n and assets | GREEN |
| `[object Module]` occurrences | 0 |
| Webpack development | GREEN / 65 artifacts |

## Local tooling incident

The initial gate was blocked by the local runtime error
`npm ERR! Cannot find module 'node-gyp/bin/node-gyp'`. The previous Node 14/npm
installation was incomplete: `node-gyp/bin/node-gyp.js` was absent. The default
runtime was Node 24 and did not provide a usable npm for this flow.

Validation used a temporary, isolated runtime with Node `14.21.3`, npm
`6.14.18`, and `node-gyp` present. No persistent `PATH`, global Node, global
npm, `package.json`, or `package-lock.json` was changed. This is a local
tooling, non-code incident and is non-blocking for 8I2.

The legacy F-B ESLint issue remains deferred and independent. Webpack
development used a temporary non-versioned `eslint-loader` isolation only for
runtime validation. The original loader was restored before this close.

## Manual acceptance

### `tipoListModification`

PASS. With synthetic data in an ephemeral PostgreSQL 17 runtime, a user
deleted `Tipo evento 8I2` from the authenticated SPA. The record disappeared
from the list without a manual browser reload, validating this end-to-end path:

`TipoDeleteDialogComponent` → `tipoListModification` → local
`JhiEventManager` → `TipoComponent` → `loadAll()`.

### `managerCareApp.httpError`

NOT SAFELY TESTABLE MANUALLY. Deliberately forcing an artificial HTTP error has
no functional need in this stage. Automated coverage is GREEN in
`AlertErrorComponent` for status 0, 400, 404, and generic error cases, together
with the local event-manager tests. This is non-blocking.

No synthetic credentials, passwords, or tokens are recorded here.

## Remaining `ng-jhipster` scope

The following remain deliberately outside 8I2: `JhiAlertService`, `JhiAlert`,
`JhiLanguageService`, `translatePartialLoader`, `missingTranslationHandler`,
`JhiConfigService`, `[jhiTranslate]`, `NgJhipsterModule`, `jhiSort`,
`jhiSortBy`, `jhi-item-count`, `jhi-boolean`, pipes, visual exports, and the
`ng-jhipster` package itself.

`JhiAlertService` and `JhiAlert` are the next compatibility target: they must
preserve success/error alerts, `X-managerCareApp-alert`,
`X-managerCareApp-params`, HTTP-error presentation, timeout, scoped/toast
behavior, and dismiss/close semantics.

## Deferred work

- F-B legacy ESLint.
- H2 Health SSL translation.
- Audit of native date inputs.
- Protractor/ChromeDriver.
- Node modernization.
- Remaining `ngcc` blockers.
- Angular 16.

## Conclusion

**8I2 LOCAL EVENT COMPATIBILITY GREEN.** Event consumers no longer import
`JhiEventManager` or `JhiEventWithContent` from `ng-jhipster`; compatibility,
technical gates, and the required end-to-end list-modification flow are
validated. The next recommended, but not started, stage is **8I3 — local alert
compatibility**.
