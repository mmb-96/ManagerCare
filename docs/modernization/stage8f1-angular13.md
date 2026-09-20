# Stage 8F1 - Angular 13

## Angular 13 migration

### Base and result

The migration starts from Angular 12.2.17 on the historical Node 12 baseline and validates the
result with a temporary, isolated Node 14.21.3 runtime and npm 6.14.18. No global Node runtime
was changed.

| Dependency | Before | After |
| --- | --- | --- |
| Angular framework | 12.2.17 | 13.3.12 |
| Angular CLI / ngtools | 12.2.18 | 13.3.11 |
| TypeScript | 4.3.5 | 4.6.4 |
| ng-bootstrap | 10.0.0 | 11.0.1 |
| RxJS | 6.5.5 | 6.5.5 |
| Zone.js | 0.11.4 | 0.11.4 |
| Webpack / CLI / dev server | 5.30.0 / 4.10.0 / 4.15.2 | unchanged |
| Jest / preset / ts-jest | 24.9.0 / 8.0.0 / transitive 24.x | 27.5.1 / 11.1.2 / 27.1.5 |
| @types/jest | 24.0.23 | 27.5.2 |
| @types/babel__traverse | transitive latest | 7.20.5 exact devDependency |

- Angular: 12.2.17 to 13.3.12.
- Angular CLI / ngtools: 13.3.11.
- TypeScript: 4.6.4.
- ng-bootstrap: 11.0.1.
- Node validation runtime: 14.21.3 with npm 6.14.18.
- RxJS, Zone.js, Webpack, Bootstrap, Moment and ng-jhipster were not upgraded.

Angular 13 official migrations removed the ten obsolete `entryComponents` declarations. The
custom Webpack build uses a linker rule limited to `@angular/*` and `@ng-bootstrap/*`, plus
scoped `.mjs` resolution. `ng-jhipster` remains outside that linker and is processed as a
View Engine dependency by ngcc.

The affected modules are `shared/shared.module.ts`, `admin/health/health.module.ts`,
`admin/user-management/user-management.module.ts`, and the entity modules for categoria-asc,
categoria, objetivo, objetivos-conseguidos, puntos-conseguidos, tipo and user-extra. Each change
removes only its official `entryComponents` metadata.

## Jest / unit-test migration

### Initial blocker

Jest 24 could not resolve `@angular/core/testing` from Angular 13's `package.json` exports.
All 60 suites failed before executing a test. This was a Jest resolver limitation, not an
application, TypeScript, template, ng-bootstrap, ng-jhipster or production Webpack failure.

### Test tooling

| Element | Before | After |
| --- | --- | --- |
| Jest | 24.9.0 | 27.5.1 |
| jest-preset-angular | 8.0.0 | 11.1.2 |
| ts-jest | transitive 24.x | 27.1.5 |
| @types/jest | 24.0.23 | 27.5.2 |
| Environment | jsdom via preset | explicit jsdom via preset 11 |
| Resolver | Jest 24 default | official `ng-jest-resolver` from preset 11 |

The migration uses the historical Angular 13 CommonJS preset path, not Jest 28. The preset
provides `.mjs` support, Angular transformation, its official resolver and `globalSetup` for
ngcc. No custom resolver and no `moduleNameMapper` to Angular internals were added.

### Focused tests

`password-strength-bar.component.spec.ts` passed with 3 tests. It proved that
`@angular/core/testing` resolves and TestBed starts correctly.

The preset's ngcc setup processed the View Engine dependencies required by the test stack,
including `ng-jhipster`, `@fortawesome/angular-fontawesome`, ngx-translate, ngx-cookie,
ngx-infinite-scroll and ngx-webstorage.

`account.service.spec.ts`, which exercises TestBed together with JHipster-related services,
then reached Angular dependency injection but failed 13 tests because the legacy test helper
calls `jasmine.createSpy`. Jest 27 does not expose a `jasmine` global. The associated
`httpMock.verify()` errors are derivative setup failures.

This is a separate Jest 24 to 27 test-helper compatibility issue. No specs, helpers, runtime
code or production configuration were changed. The unit suite and subsequent regressions remain
pending a separately authorized decision on preserving or replacing the Jasmine-compatible spy
helper.

### Secondary blocker - Jasmine runner semantics

Jest 24 used the Jasmine runner historically, while Jest 27 defaults to `jest-circus`. The
legacy helper uses `jasmine.createSpy`; therefore the initial Angular 13/Jest 27 Account Service
failure was runner-specific, after Angular testing and dependency injection had already started.

### Resolution

Jest 27.5.1 already includes `jest-jasmine2` 27.5.1 transitively alongside `jest-circus`.
The Jest configuration therefore sets `testRunner: 'jest-jasmine2'`; no new direct dependency,
global Jasmine shim, custom resolver, mapping or helper/spec change was required.

The effective runner changed from `jest-circus/runner.js` to
`jest-jasmine2/build/index.js`. The Jasmine runner is retained as a temporary compatibility
measure; a future test-stack modernization may migrate legacy Jasmine spies to native Jest APIs.

### Focused verification

- PasswordStrengthBar TestBed spec: 3/3 passed.
- Account Service spec: 13/13 passed, including `jasmine.createSpy`, DI and
  `HttpTestingController`.
- Objetivo delete-dialog spec: 2/2 passed using `JhiEventManager` and ng-jhipster.

The preset's official global setup processed the required View Engine libraries through ngcc.

### A13-C

The complete suite passed: 60 suites and 181 tests, with no failures. The runner emitted an
esbuild worker shutdown warning after completion; it did not fail a suite. ts-jest also retains
its non-blocking TS151001 `esModuleInterop` suggestion, which was not acted upon.

### Tertiary blocker - Babel type definitions

The subsequent `ngc` regression initially stopped before application compilation on
`@types/babel__traverse` 7.28.0. Its declaration syntax (`infer N extends number`) cannot be
parsed by the Angular 13-compatible TypeScript 4.6.4 baseline. This was a transitive Babel/Jest
type-tree resolution issue, not an Angular compiler, application, template, ng-bootstrap,
ng-jhipster, linker or production Webpack failure.

The published compatibility lines are: 7.28.0 for TypeScript 5.1 or later, 7.20.6 for TypeScript
4.7 or later, and 7.20.5 for TypeScript 4.6. The project therefore adds the exact development
dependency `@types/babel__traverse` 7.20.5. It stabilizes the TypeScript 4.6 contract without
changing runtime production dependencies, TypeScript or Angular.

The resolved consumers all accept that version: `@types/babel__core` requests `*`,
`babel-plugin-jest-hoist` requests `^7.0.6`, and `jest-snapshot` requests `^7.0.4`. Version
7.20.5 requires `@babel/types` `^7.20.7`; no Node engine, peer-dependency or semver conflict was
introduced. The final npm tree contains one deduplicated 7.20.5 version. No override, resolution,
manual lockfile edit, patch, `skipLibCheck` or TypeScript change was used.

## Validation status

### A13-A - reproducible installation

`npm ci --ignore-scripts` completed from clean state with Node 14.21.3/npm 6.14.18 and the
committed lockfile.

### A13-B - deferred lint gate

The lint gate remains deferred under the temporary gates defined in
`stage8d1-lint-decoupling.md`.

### A13-BT

ngcc, including ng-jhipster View Engine processing, and ngc both passed with zero TypeScript,
Angular compiler, template, linker or Ivy diagnostics.

### A13-C

The Jest suite passed: 60 suites and 181 tests.

### A13-D

The production Webpack build passed with 73 static artifacts and was reproduced from clean
installation.

### A13-E

The production smoke returned HTTP 200 for both `index.html` and the generated main bundle.

### A13-DEV

The development infrastructure reaches only the known F-B lint-tooling blocker in
`eslint-loader` / legacy `@typescript-eslint`, which cannot load Angular's ESM compiler. No
ESLint modernization was attempted.

### F-F

The legacy Protractor E2E gate remains non-blocking: ChromeDriver 114 is incompatible with the
available Chrome 153. This is deferred to a dedicated E2E/tooling stage.

### A13-DIFF

No workaround was introduced: no lint disables, TypeScript ignores, opportunistic `any`, skipped
tests, `skipLibCheck`, `transpileOnly`, override/resolution, Angular resolver hack, Jasmine shim
or node_modules patch is present.

### Dependabot baseline before merge

| Severity | Alerts |
| --- | ---: |
| Critical | 13 |
| High | 97 |
| Medium | 69 |
| Low | 12 |
| Total | 191 |

Critical plus high alerts total 110 across 47 unique packages.

### Remaining debt

- Angular 14 and later.
- ESLint modernization.
- Temporary `jest-jasmine2` compatibility.
- Legacy ng-jhipster/ngcc processing.
- Protractor/WebDriver, Moment, Bootstrap and RxJS modernization.

## Warnings

- ts-jest reports TS151001 suggesting `esModuleInterop`; it was not changed because no import
  failure was demonstrated.
