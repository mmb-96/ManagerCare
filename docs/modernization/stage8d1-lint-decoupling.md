# Stage 8D1 — Legacy lint decoupling assessment

## Context

Stage 8D (Angular 10 to 11) was blocked because Angular 11 requires TypeScript 4, while the historical `@typescript-eslint` 2.11.0 tooling does not support TypeScript 4. This stage assessed whether the historical lint gate could be preserved without turning an Angular framework upgrade into a full ESLint modernization.

## Historical baseline

The verified Angular 10 baseline uses:

- Angular 10.2.5;
- TypeScript 3.9.10;
- ESLint 6.7.2;
- `@typescript-eslint/parser` 2.11.0;
- `@typescript-eslint/eslint-plugin` 2.11.0.

The normal lint command completed with 0 errors and 0 warnings.

## Attempt 1 — `@typescript-eslint` 3.10.1

With TypeScript 3.9.10, updating the parser, plugin, and TSLint bridge to 3.10.1 produced 372 errors and 19 warnings. The main newly active rules were:

- `no-unsafe-assignment`;
- `no-unsafe-member-access`;
- `no-floating-promises`;
- `restrict-plus-operands`;
- `no-unsafe-return`;
- `no-unsafe-call`;
- `explicit-module-boundary-types`.

Disabling only those seven rules restored L-1 to 0 errors and 0 warnings, but did not establish semantic equivalence.

## Effective configuration differences

The effective configuration still contained 22 additional differences. Relevant cases included:

- `ban-ts-ignore` to `ban-ts-comment`;
- `camelcase`;
- `class-name-casing`;
- `consistent-type-assertions`;
- `no-use-before-define`;
- `prefer-includes`;
- `prefer-string-starts-ends-with`;
- `constructor-super`;
- `no-func-assign`;
- `no-obj-calls`;
- `no-unsafe-negation`.

Some differences can be described as renamed, moved, newly enabled, or disabled by the newer preset. That alone is insufficient to prove equivalent lint behaviour.

## Blocking semantic difference

`@typescript-eslint/camelcase` in 2.11.0 is the definitive blocker. The historical baseline reports `snake_case` and certain object properties, but does not report a generic type parameter such as `T_bad`.

ESLint core `camelcase` reports `T_bad`, so it is not equivalent. `@typescript-eslint/naming-convention` cannot reasonably reproduce the historical distinction between object properties and TypeScript properties/types with a 1:1 mapping. The semantic mapping approach is therefore discarded.

## Attempt 2 — isolated historical harness

An external harness used the exact historical tooling:

- ESLint 6.7.2;
- `@typescript-eslint/parser`, plugin, and plugin-tslint 2.11.0;
- TypeScript 3.9.10;
- TSLint 6.0.0;
- JHipster ESLint config 0.0.1;
- Prettier config 6.7.0;
- historical Codelyzer dependencies.

It reused the same `.eslintrc.json`, `.eslintignore`, `tslint.json`, tsconfig files, and source tree. Against the same Angular 10 and TypeScript 3.9 application, it produced 37 `@typescript-eslint/require-await` errors in E2E code instead of the normal 0 errors and 0 warnings.

The harness therefore does not reproduce the baseline and cannot safely decouple lint from the application TypeScript version. TypeScript 4 and an Angular 11 graph were not tested with this harness.

## Decision

F-B, the legacy lint gate, is temporarily **DEFERRED** beginning with Angular 10 to 11 and during later Angular upgrades for which the historical tooling remains incompatible.

ESLint is neither removed nor disabled by this decision. It will be modernized in a separate, explicit stage. Until then, it is not a blocking gate for the affected Angular framework migrations.

## Temporary migration gates

### F-A — Reproducible install

- `npm ci` from a clean state;
- stable lockfile;
- unchanged `package.json`.

### F-BT — Angular/TypeScript compilation

- Angular compiler without errors;
- TypeScript without errors;
- no template compiler errors.

This partially replaces static-error detection while F-B is deferred.

### F-C — Unit tests

Current baseline:

- 60 suites;
- 181 tests;
- 0 failures.

No tests may be disabled.

### F-D — Production build

- green production build;
- expected output;
- no Angular or Webpack errors.

### F-E — Backend contract / smoke

The following remain preserved:

- `/api/authenticate`;
- `/api/account`;
- `Authorization: Bearer`;
- JWT;
- `X-Total-Count`;
- `Link`;
- `X-managerCareApp-alert`;
- `X-managerCareApp-params`;
- `application/problem+json`;
- 401 and 403 semantics.

### F-DIFF — Migration diff review

Required for every Angular upgrade while F-B is deferred. Verify:

- no unexplained functional change;
- no mass cleanup or opportunistic refactor;
- no disabled tests;
- no `any` introduced to silence TypeScript;
- no new `@ts-ignore` or `@ts-nocheck` without explicit authorization;
- no new `eslint-disable` used to hide problems;
- migrations limited to the framework and tooling upgrade.

### F-F — E2E

F-F remains non-blocking because of the existing legacy tooling debt: ChromeDriver 114 is incompatible with Chrome 153. It is not addressed during these Angular upgrades without a dedicated E2E tooling stage.

## Risk assessment

| Area | Temporarily lost protection | Compensating coverage |
| --- | --- | --- |
| Style/naming | Historical ESLint naming conventions | F-DIFF; no automatic equivalent |
| Probable errors | Part of ESLint core and TypeScript rules | F-BT, unit tests, and review |
| Type-aware lint | Promises, `require-await`, and similar rules | Tests and review; lower coverage |
| Compiler-covered issues | Part already checked by TypeScript/Angular | F-BT |

The compensating gates are not equivalent to ESLint. This is a conscious, documented temporary reduction in coverage to avoid blocking framework modernization with obsolete tooling.

## Scope restrictions

While F-B is deferred, Angular upgrades must not be used to:

- perform mass lint debt fixes;
- run global `eslint --fix`;
- introduce `any` as a workaround;
- add `eslint-disable` directives;
- remove rules;
- partially migrate to modern ESLint;
- perform stylistic refactors.

## Reactivation condition

F-B becomes mandatory again after a dedicated ESLint modernization stage establishes a new explicit baseline. That stage must define and review a new policy deliberately; it must not claim perfect equivalence with `@typescript-eslint` 2.11.0 for rules that no longer exist.

## Next step

The next proposed stage is a clean retry of Angular 10 to 11 from master in a future branch, for example `modernization/08d-angular11-v2`.

That attempt will use F-A, F-BT, F-C, F-D, F-E, and F-DIFF. F-B legacy lint will not be blocking, and F-F remains known non-blocking debt. This document does not start that stage.
