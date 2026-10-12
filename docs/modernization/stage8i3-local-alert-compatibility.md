# Stage 8I3 — local alert compatibility

## Scope

Stage 8I3 replaces the functional use of `JhiAlertService` and `JhiAlert` from
`ng-jhipster` with a small local compatibility layer. It is a compatibility
decoupling, not an alert-system redesign: no notification library, NgRx,
signals, external toast framework, or broad naming change was introduced.

## Base

`04023727f984cd3006528142157f98034afba31d`

## Previous ng-jhipster dependency

- `JhiAlertService`
- `JhiAlert`

`ng-jhipster` and `NgJhipsterModule` remain installed and unchanged. Other
exports are intentionally outside this stage.

## Original consumers migrated

| Consumer | Previous dependency | Local dependency | Role |
| --- | --- | --- | --- |
| `AlertComponent` | `JhiAlertService`, `JhiAlert` from `ng-jhipster` | local alert service and model | Renders global alerts and clears the shared collection on destroy. |
| `AlertErrorComponent` | `JhiAlertService`, `JhiAlert` from `ng-jhipster` | local alert service and model | Renders scoped HTTP and application error alerts. |
| `NotificationInterceptor` | `JhiAlertService` from `ng-jhipster` | local alert service | Converts response-alert headers into success alerts. |

## Local compatibility implementation

- `src/main/webapp/app/shared/jhipster-compat/alert.model.ts`
- `src/main/webapp/app/shared/jhipster-compat/alert.service.ts`

`JhiAlertService` is a root singleton through `@Injectable({ providedIn: 'root' })`.
It retains a mutable global collection: `get()` returns the same array,
`clear()` splices that array, and global alerts retain insertion order.

The implemented public contract is:

| API | Behaviour |
| --- | --- |
| `get()` | Returns the mutable global collection. |
| `clear()` | Clears the existing global collection without replacing it. |
| `success()`, `error()`, `warning()`, `info()` | Add global alerts with `success`, `danger`, `warning`, and `info` types respectively. |
| `addAlert()` | Assigns an id, translates when i18n is enabled, sanitizes the message, creates the close callback, and schedules timeout dismissal when configured. |
| `closeAlert()` | Selects scoped alerts when supplied and non-empty; otherwise selects the global collection. |
| `closeAlertByIndex()` | Removes the selected alert using the historical index semantics. |
| `isToast()` | Returns the configured toast setting. |

The local `JhiAlert` model contains the properties consumed by ManagerCare:
`id`, `type`, `msg`, `params`, `timeout`, `toast`, `position`, `scoped`, and
`close`.

Translation keys and their parameters are passed to `TranslateService` before
the resulting alert is rendered. The configured timeout controls automatic
dismissal. `position` defaults to `top right`, and the rendering components
preserve `jhi-toast` and position classes.

### Scoped and toast behaviour

- **SCOPED USED: YES.** `AlertErrorComponent` creates scoped danger alerts in
  its local alert collection; they are not inserted into the global collection
  and use the retained close callback.
- **TOAST USED: NO in the validated runtime.** The current configuration has
  `alertAsToast: false`; the service and components nevertheless preserve the
  config-driven toast contract for later configurations.

## Notification flow

`NotificationInterceptor` preserves the existing response-header contract:

- `X-managerCareApp-alert`
- `X-managerCareApp-params`

Header names, decoding of `+` and percent-encoded values, translation keys,
and parameter shape are unchanged. The validated path is:

`backend response` → headers → `NotificationInterceptor` → local
`JhiAlertService` → `AlertComponent` → visual rendering.

## HTTP error flow

Stage 8I2 already moved `JhiEventManager` and `JhiEventWithContent` to their
local compatibility layer. Stage 8I3 preserves this path without changing its
event transport:

`ErrorHandlerInterceptor` → `managerCareApp.httpError` → local
`JhiEventManager` → `AlertErrorComponent` → local `JhiAlertService`.

`AlertErrorComponent` retains handling for status `0`, `400`, `404`, and
generic errors.

## JhiConfigService and language

`JhiConfigService` remains temporarily imported from `ng-jhipster` only for
the alert configuration required by this compatibility service: timeout,
toast, and i18n settings.

**REMAINS TEMPORARILY FROM NG-JHIPSTER — TO BE HANDLED IN 8I4.**

`JhiLanguageService`, `translatePartialLoader`, `missingTranslationHandler`,
and `[jhiTranslate]` are not migrated in this stage.

## Residual imports

- `JhiAlertService` from `ng-jhipster`: **0**
- `JhiAlert` from `ng-jhipster`: **0**

Remaining `ng-jhipster` imports are legitimate deferred language, config,
module, and visual-feature dependencies.

## Automated tests

| Validation | Result |
| --- | --- |
| Baseline after 8I2 | 63 suites / 195 tests / 0 failures |
| Alert focal baseline | `AlertErrorComponent`: 1 suite / 7 tests / 0 failures |
| Alert focal final | 4 suites / 14 tests / 0 failures |
| Final Jest | 66 suites / 202 tests / 0 failures |

The three added suites are:

- `alert.service.spec.ts`: mutable collection, ordering, translated parameters,
  timeout, scoped close callback, and clear semantics.
- `notification.interceptor.spec.ts`: exact alert headers and decoded parameter.
- `alert.component.spec.ts`: collection lifecycle plus toast and position
  classes.

Existing `alert-error.component.spec.ts`, the alert mock, and the test module
were updated only to use the local compatibility service.

## Technical gates

| Gate | Result |
| --- | --- |
| `ngc` | 0 diagnostics |
| Jest focal | 4 suites / 14 tests / 0 failures |
| Jest complete | 66 suites / 202 tests / 0 failures |
| Webpack production | GREEN |
| Production artifacts | 73 |
| Static index references | GREEN |
| Workbox | GREEN |
| i18n | GREEN |
| Assets | GREEN |
| `[object Module]` | 0 |
| Webpack development | GREEN |

## Manual acceptance

### Success create

An ephemeral PostgreSQL 17 runtime was used with synthetic data only. Creating
the synthetic `Tipo` named `alert-8i3-manual-success` showed:

`Un nuevo Tipo ha sido creado con el identificador 1101`

**PASS**

### Timeout

The first success alert disappeared automatically during the manual session.

**PASS**

### Update and manual close

The same synthetic record was updated to `alert-8i3-manual-dismiss`, showing:

`Un Tipo ha sido actualizado con el identificador 1101`

Pressing **Close** removed the alert text from the DOM.

**PASS**

### Console

ManagerCare console errors during the manual flows: **0**.

### HTTP error

**NOT SAFELY TESTABLE MANUALLY.** No artificial functional failure was forced
solely to display an error alert. Automated coverage is green through
`AlertErrorComponent`, local alert-service tests, notification-interceptor
tests, and the local EventManager coverage.

## Runtime tooling

The validation used an isolated, temporary runtime:

- Node `14.21.3`
- npm `6.14.18`

No persistent PATH, global Node, or global npm setting was modified.

`F-B` legacy ESLint remains deferred and independent. Development Webpack
validation used a non-versioned, temporary `eslint-loader` isolation measure;
the original file was restored and verified before this commit.

## Remaining ng-jhipster work

Deferred intentionally:

- `JhiLanguageService`
- `translatePartialLoader`
- `missingTranslationHandler`
- `JhiConfigService`
- `[jhiTranslate]`
- `NgJhipsterModule` visual exports
- `jhiSort`, `jhiSortBy`, `jhi-item-count`, `jhi-boolean`, pipes
- removal of the `ng-jhipster` package

Other deferred work includes `F-B` ESLint, H2 Health SSL translation, native
date-input audits, Protractor/ChromeDriver, Node modernization, remaining ngcc
blockers, and Angular 16 blockers such as `@fortawesome/angular-fontawesome`,
`@ngx-translate/core`, `@ngx-translate/http-loader`, `ngx-cookie`,
`ngx-infinite-scroll`, and `ngx-webstorage`.

## Conclusion

**8I3 LOCAL ALERT COMPATIBILITY GREEN.** The alert service and model no longer
come from `ng-jhipster` consumers, while the observed success, timeout, manual
close, translation/header, scoped-error, and error-event contracts remain
compatible.
