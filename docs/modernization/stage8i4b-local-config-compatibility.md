# Stage 8I4B — local config compatibility

## Scope

This stage introduces the first local compatibility configuration used by
ManagerCare while retaining the legacy translation bootstrap that still
requires `ng-jhipster`.

## Base

`85baa320bf6ae1e80b5119a8218bf3ee1c59aa3e`

## Previous dependency

`JhiConfigService` was consumed by the local alert compatibility layer. This
stage does not remove the final legacy consumer in `CoreModule`: it remains
temporarily necessary for the `missingTranslationHandler` bootstrap path.

## Local configuration

`config.model.ts` defines the typed `JhiCompatConfig` contract and the single
ManagerCare source, `MANAGERCARE_CONFIG`. `config.service.ts` exposes a local
`JHI_COMPAT_CONFIG` `InjectionToken` and a root `JhiConfigService` with
`getConfig()`.

`CoreModule` passes `MANAGERCARE_CONFIG` to the legacy
`NgJhipsterModule.forRoot(...)` call and provides the same source through the
local token. The local service copies its initial value into its own
configuration object, so it does not claim shared-reference mutability with
the legacy module.

### Configuration values

| Key | Value | Consumer |
| --- | --- | --- |
| `alertAsToast` | `false` | local alert service and legacy bootstrap input |
| `alertTimeout` | `5000` | local alert service and legacy bootstrap input |
| `i18nEnabled` | `true` | local alert service and legacy bootstrap input |
| `defaultI18nLang` | `es` | local service, prepared for 8I4C |
| `noi18nMessage` | `translation-not-found` | local configuration contract |

### Mutability

`getConfig()` returns the object retained by the local service. The focused
test confirms that changing `defaultI18nLang` remains visible to later reads.
This is intentional preparation for the local `JhiLanguageService` in 8I4C.

## Alert service migration

`src/main/webapp/app/shared/jhipster-compat/alert.service.ts` now receives the
local `JhiConfigService`; only its configuration source changed. The closed
8I3 alert contract remains intact: `alertTimeout`, `alertAsToast`,
`i18nEnabled`, success/error/warning/info handling, timeout, scoped alerts,
toast behavior, translation, close, clear, and sanitization are unchanged.

## Legacy configuration remaining

The only product import of `JhiConfigService` from `ng-jhipster` is in
`src/main/webapp/app/core/core.module.ts`, where it is a dependency of
`missingTranslationHandler`. Its removal is deferred to **8I4D — translation
bootstrap compatibility**.

## Tests

| Suite | Result |
| --- | --- |
| Baseline after 8I3 | 66 suites / 202 tests / 0 failures |
| 8I4B focal | 2 suites / 6 tests / 0 failures |
| 8I4B final | 67 suites / 204 tests / 0 failures |

The focal suites are `config.service.spec.ts` and `alert.service.spec.ts`.

## Technical gates

| Gate | Result |
| --- | --- |
| `ngc` | 0 diagnostics |
| Jest focal | 2 suites / 6 tests / 0 failures |
| Jest complete | 67 suites / 204 tests / 0 failures |
| Webpack production | GREEN |
| Production artifacts | 73 |
| Static validation | GREEN |
| `index.html` references | GREEN |
| Workbox | GREEN |
| `i18n/es.json` | GREEN |
| assets | GREEN |
| `[object Module]` | 0 |
| Webpack development | GREEN |
| Webpack version | 5.75.0 |

Inherited non-blocking warnings remain: outdated `caniuse-lite`, Babel
size/deoptimisation notices, and historical `DefinePlugin` messages.

## Manual acceptance

- Bootstrap and DI: PASS.
- Translated success alert: PASS.
- `alertAsToast = false`: PASS; the alert is integrated in the page rather
  than presented as a toast.
- `alertTimeout = 5000`: PASS; manual validation confirmed automatic
  disappearance after a few seconds, while unit tests protect the exact value.
- Console: PASS; no new ManagerCare DI, translation, or configuration error.

## Tooling

An official temporary Node runtime was verified for the validation: Node
14.21.3, npm 6.14.18, and present `node-gyp.js`. Canonical npm gates ran
without a npm bypass, persistent PATH changes, global Node/npm changes, or a
package graph change.

## Remaining 8I4 work

### 8I4C

Local `JhiLanguageService` preserving `init()`, `changeLanguage()`,
`getCurrentLanguage()`, default `es`, `sessionStorage.locale`,
`account.langKey`, registration `langKey`, persisted settings, and current
synchronous behavior.

### 8I4D

`translatePartialLoader`, `missingTranslationHandler`, and the remaining
legacy `JhiConfigService` consumer.

### Later design

`[jhiTranslate]`.

## Deferred

- visual exports;
- complete `ng-jhipster` removal;
- F-B ESLint;
- H2 SSL translation;
- audits of native dates;
- Protractor/ChromeDriver;
- Node modernization;
- remaining ngcc blockers;
- Angular 16.

## Conclusion

**8I4B LOCAL CONFIG COMPATIBILITY GREEN**
