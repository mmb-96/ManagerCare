# Stage 8G0 - Angular 14 readiness

## Scope and base

Assessment only, based on `master` commit
`8a5eccbe03220f7249114119e1dfa16d4c857880`. This stage changes neither
dependencies nor source, templates, SCSS, Webpack, Jest, ESLint, Node, npm or
the lockfile.

| Area | Current |
| --- | --- |
| Angular framework | 13.3.12 |
| CLI / ngtools | 13.3.11 / 13.3.11 |
| TypeScript | 4.6.4 |
| Node / npm validation runtime | 14.21.3 / 6.14.18 |
| RxJS / Zone.js | 6.5.5 / 0.11.4 |
| ng-bootstrap / Bootstrap | 11.0.1 / 4.4.1 |
| Webpack / CLI / dev server | 5.30.0 / 4.10.0 / 4.15.2 |
| Jest / preset / ts-jest / runner | 27.5.1 / 11.1.2 / 27.1.5 / jest-jasmine2 27.5.1 |
| Babel Traverse types | exact `@types/babel__traverse` 7.20.5 |
| Lockfile | npm lockfile v1 |

The Angular 13 baseline remains: install and ngc reproducible; 60 suites / 181
tests; production build with 73 artifacts and production smoke green. F-B stays
deferred for the known legacy ESLint boundary, and F-F stays deferred because
ChromeDriver 114 does not support the available Chrome 153.

Dependabot after Angular 13: 183 open npm alerts (12 critical, 94 high, 65
medium, 12 low); 106 critical/high alerts across 45 unique packages. No alert is
remediated here.

## Angular 14 compatibility and candidate

Angular's historical compatibility table gives Angular 14.2/14.3 these ranges:
Node `^14.15.0 || ^16.10.0`, TypeScript `>=4.6.2 <4.9.0`, and RxJS
`^6.5.3 || ^7.4.0`. Node 14.21.3 and RxJS 6.5.5 can therefore remain. npm
6.14.18 is accepted by Angular CLI 14.2.13 (`^6.11.0 || ^7.5.6 || >=8`);
npm 6 can preserve lockfile v1.

| Package | Current | Candidate |
| --- | ---: | ---: |
| Angular framework / compiler-cli | 13.3.12 | 14.2.12 |
| Angular CLI | 13.3.11 | 14.2.13 |
| Angular devkit and schematics | 13.3.x | 14.2.13 / 0.1402.13 |
| `@ngtools/webpack` | 13.3.11 | 14.2.13 |
| TypeScript | 4.6.4 | retain 4.6.4 first |
| RxJS | 6.5.5 | retain 6.5.5 |
| Webpack | 5.30.0 | at least 5.54.0 |

The ngtools 14.2.13 peer graph requires Webpack `^5.54.0`, TypeScript
`>=4.6.2 <4.9`, and compiler-cli `^14.0.0`. Webpack 5.30.0 is consequently
a P0 peer change, not an opportunistic upgrade.

TypeScript 4.6.4 is the safest first candidate: it is accepted by Angular 14.2
and isolates the framework change. The exact Babel Traverse 7.20.5 pin remains
needed for TypeScript 4.6. TypeScript 4.7/4.8 is allowed later, but it is not a
reason to remove the pin without compiler evidence.

## ng-bootstrap, Bootstrap and Popper boundary

Official ng-bootstrap compatibility and published peers:

| ng-bootstrap | Angular peer | Bootstrap CSS tested | Popper | Result |
| --- | --- | --- | --- | --- |
| 11.0.1 | `^13.0.0` | 4.6.0 | none | current; not Angular 14-supported |
| 12.1.2 | `^13.0.0` | 5.0.0 | `@popperjs/core ^2.10.2` | official Angular 13 + Bootstrap 5 bridge |
| 13.1.1 | `^14.1.0` | 5.2.0 | `@popperjs/core ^2.10.2` | Angular 14 candidate |

ng-bootstrap 11 with Angular 14 is **known incompatible by peer range**. Angular
14.2 needs ng-bootstrap 13.1.1, Bootstrap 5.2.0 and Popper 2. Bootstrap 5 is
therefore P0 for the Angular 14 implementation, but the official Angular 13 +
ng-bootstrap 12 bridge can isolate it first.

| Dependency/integration | Current evidence | Bootstrap 5 implication |
| --- | --- | --- |
| Bootstrap | 4.4.1 | use 5.0.0 in bridge, 5.2.0 with ng-bootstrap 13 |
| Popper | neither Popper v1 nor v2 declared | add Popper 2 with ng-bootstrap 12/13 |
| jQuery / Bootstrap JS | no dependency or direct import | CSS plus ng-bootstrap only |
| Bootswatch / Glyphicons | no dependency or import | Font Awesome is the icon system |

The navbar has one Bootstrap-4 `data-toggle/data-target` pair, but state is
actually changed by Angular `toggleNavbar()`; no Bootstrap JavaScript import
exists.

### HTML impact measured in src/main/webapp

| Bootstrap 4 pattern | Occurrences | Files | Bootstrap 5 validation |
| --- | ---: | ---: | --- |
| `ml-*` | 1 | 1 | logical `ms-*` |
| `text-left` / `text-right` | 4 / 12 | 1 / 11 | `text-start/end` |
| `float-left` / `float-right` | 1 / 13 | 1 / 12 | `float-start/end` |
| `close` button class | 10 | 10 | Bootstrap 5 `btn-close` markup/accessibility |
| `data-dismiss="modal"` | 19 | 10 | retain Angular modal handlers; remove/replace stale data attributes |
| `form-group` | 52 | 14 | spacing/layout review; grouping utility was dropped |
| `form-control-label` | 37 | 13 | review Bootstrap 5 label styling |
| input-group prepend/append | 2 | 1 | Bootstrap 5 direct input-group markup |
| badge variants | 4 | 3 | contextual `bg-*` classes |
| custom controls, jumbotron, card-deck, no-gutters, btn-block, dropdown-menu-right | 0 | 0 | no discovered migration work |

There are 25 logical-direction utility occurrences across 16 files, ten modal
templates and fourteen form templates. Counts are evidence for review scope, not
proof that every occurrence needs the same edit.

### SCSS and visual impact

Bootstrap is imported by `content/scss/vendor.scss`; `global.scss`,
`layouts/navbar/navbar.scss`, and `admin/docs/docs.scss` import Bootstrap
functions/variables.

| Variable or area | Local use | Bootstrap 5 risk |
| --- | --- | --- |
| colors, body, radius, font size | `_bootstrap-variables.scss` | verify defaults/names |
| `$enable-hover-media-query` | one override | removed Bootstrap 4 option; P0 SCSS compilation |
| grid/print options | one override each | verify availability or replacement |
| dropdown hover/active variables | 6 uses | verify generated CSS |
| `$navbar-dark-color` | one use | verify compatibility |

No vendor theme exists beyond Bootstrap. Visual validation must cover navbar,
dropdowns, login, register/settings/password and reset forms, user management,
audits, health, entity lists/forms/delete modals, pagination and tooltips.

### ng-bootstrap APIs and modals

There are 26 TypeScript files importing ng-bootstrap. Local API use is
`NgbModule`, `NgbModal`, `NgbModalRef`, `NgbActiveModal`,
`NgbPaginationConfig`, `NgbDateAdapter`, `NgbDateStruct` and
`NgbDatepickerConfig`. Templates use two pagination instances, 28 tooltips,
12 dropdown directives and one collapse directive. There are ten
`modalService.open(...)` calls and ten modal templates.

| Area | Use | Risk |
| --- | --- | --- |
| modal / active modal | 10 opens, 10 templates | P1 backdrop, close button and dismissal visual regression |
| pagination | configuration plus 2 templates | P1 markup/CSS review |
| Moment date adapter / datepicker config | shared adapter and core config | P1 focused functional regression |
| tooltip / dropdown / collapse | 28 / 12 / 1 | P1 placement and Popper validation |
| module | shared-libs module | P0 peer/module compile validation |

No accordion, carousel, typeahead, tabset/nav or manual Bootstrap modal API was
found. Eight delete flows use a static backdrop.

## Jest 28 boundary

jest-preset-angular 12.1.0 added Angular 14 support; 12.2.6 is the stable
candidate. Its peers require Jest 28, TypeScript >=4.2, Angular
core/compiler-cli/platform-browser-dynamic >=12.2.16 and <16, and
build-angular >=12.2.18 and <16.

| Package | Current | Angular 14 candidate |
| --- | ---: | ---: |
| Jest | 27.5.1 | 28.1.3 |
| jest-preset-angular | 11.1.2 | 12.2.6 |
| ts-jest | 27.1.5 | 28.0.8 |
| @types/jest | 27.5.2 | 28.x aligned |
| jest-environment-jsdom | implicit | explicit 28.1.3 |
| jest-jasmine2 | 27.5.1 | explicit 28.1.3 |

Jest 28 requires jsdom to be explicit. jest-jasmine2 28.1.3 is published and
can preserve the existing `jasmine.createSpy` semantics; helpers must not move
to `jest.fn` unless a proven Jest 28 blocker requires it. Preset 12 removes
the need for ng-jest-resolver, retains globalSetup for ngcc, alters default
mjs/esbuild handling, and requires a focused review of the existing
ts-jest globals, transform ignore and setup files.

## ngcc, linker, APF and Webpack

Angular 14 retains ngcc. View Engine ng-jhipster 0.12.0 can therefore remain
temporarily, but an isolated install must prove its processing. The existing
selective linker covers only `@angular/*` and `@ng-bootstrap/*`, with mjs and
`fullySpecified: false`; keep that scope initially and do not widen it without
a focused build failure. Webpack needs only its ngtools peer-driven minimum
5.54.0; retain webpack-cli 4.10.0 and dev-server 4.15.2 unless a candidate tree
rejects them.

## Angular migrations and typed forms

Apply official Angular 13-to-14 migrations only in a future implementation
stage, then inspect their diff. Required package/config migrations, tsconfig
changes and generated code/template changes must be evaluated separately. Lint
is explicitly excluded and standalone APIs are not adopted: the NgModule
architecture remains.

Angular 14 types reactive forms by default. There are 15 TypeScript files using
FormBuilder/reactive forms (login, account flows, user management and entity
updates); no FormArray use was found. Preserve existing form semantics using
official `Untyped*` types when the migration selects them. This is P1 compile
work, not a manual typed-forms redesign.

No Angular-14-specific removed API was found in the local Router/HTTP surface
that justifies a pre-emptive edit.

## P0/P1/P2/P3

### P0

- ng-bootstrap 11 peer replacement, Bootstrap 5 and Popper 2.
- Webpack >=5.54 required by ngtools 14.
- Jest 28 / preset 12 / ts-jest 28 with explicit jsdom and Jasmine runner gate.
- ngcc processing of ng-jhipster and scoped linker proof.

### P1

- Measured Bootstrap classes, modal markup, forms and SCSS variables.
- Modal, pagination, datepicker, tooltip, dropdown and collapse visual/function checks.
- Typed reactive forms in 15 files.

### P2

- Node 14.21.3, npm 6.14.18, lockfile v1, RxJS 6.5.5 and TypeScript 4.6.4.
- Babel Traverse 7.20.5, NgModules, jest-jasmine2, F-B, F-F and ng-jhipster/ngcc.
- Moment and current Dependabot debt.

### P3

- TypeScript 4.7/4.8 after an Angular 14 green baseline.
- Jasmine-helper conversion, RxJS 7, standalone APIs, Moment, ESLint and E2E modernization.

## Recommended strategy and proposed stages

Use **Strategy D: isolated coordinated mini-stages**, not one combined migration.

1. **8G1 - Bootstrap 5 bridge on Angular 13**: ng-bootstrap 12.1.2,
   Bootstrap 5.0.0 and Popper 2; migrate only the measured UI surface.
2. **8G2 - Angular 14 compiler/toolchain**: Angular 14.2.12, CLI/devkit/ngtools
   14.2.13 and Webpack >=5.54, retaining Node 14, npm 6, TypeScript 4.6.4 and
   RxJS 6.5.5.
3. **8G3 - ng-bootstrap 13 alignment**: ng-bootstrap 13.1.1 and Bootstrap 5.2.0
   with Popper 2, if a temporary peer graph does not safely combine it with 8G2.
4. **8G4 - Jest 28 for Angular 14**: preset 12.2.6, Jest/ts-jest/jsdom/
   jest-jasmine2 28.1.3, retaining Jasmine compatibility.
5. **8G5 - Angular 14 migration diff and validation**: only official migrations,
   typed-form review and full validation.

The Angular-13/ng-bootstrap-12 bridge is officially supported. Combining 8G2
and 8G3 is acceptable only after a clean temporary peer graph; keeping Bootstrap
and Jest independent makes regressions attributable.

## Proposed gates

- **A14-A**: reproducible npm 6 / lockfile-v1 installation.
- **A14-BT**: ngcc + ngc, compiler/template/linker diagnostics.
- **A14-C**: TestBed focal, Jasmine createSpy focal, then 60 suites / 181 tests.
- **A14-D**: production build and artifact/smoke check.
- **A14-E**: backend contract/static smoke and strict diff.
- **BS-HTML**: no accidental Bootstrap 4 remnants in the measured set.
- **BS-SCSS**: Bootstrap 5 SCSS/overrides compile.
- **BS-VISUAL**: listed UI targets reviewed.
- **J-A/J-B/J-C/J-D**: runner/resolver, TestBed, Jasmine compatibility, full suite.

F-B and F-F remain outside the sequence.

## Evidence consulted

- Angular historical version compatibility and typed-forms guidance.
- ng-bootstrap compatibility matrix and npm peer metadata for 11.0.1, 12.1.2
  and 13.1.1.
- npm metadata for Angular 14.2.12/14.2.13, ngtools 14.2.13, Jest 28, ts-jest
  28 and jest-preset-angular 12.2.6.
- jest-preset-angular 12 changelog for Angular 14/Jest 28 support.
