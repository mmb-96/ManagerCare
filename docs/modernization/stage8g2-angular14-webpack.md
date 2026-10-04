# Stage 8G2 — Angular 14 coordinated compatibility

## Base and roadmap

Base `master`: `539a98f605ca9c648169a8081f54aae0fc15e4a2`.

The initial plan separated Angular 14/Webpack (8G2), ng-bootstrap 13 and
Bootstrap 5.2 (8G3), Jest 28 (8G4), and official migrations (8G5). Two
dependencies made the first three work items a single coordinated change:

- **8G3 absorbed into 8G2 due to hard peer dependency.** ng-bootstrap 12.1.2
  supports Angular 13, while Angular 14 requires ng-bootstrap 13.
- **8G4 absorbed into 8G2 for Angular 14 test tooling compatibility.** Jest 27
  with jest-preset-angular 11 failed resolving Angular 14 testing exports before
  any suite ran.

8G5 remains reserved for official Angular migrations and full validation.

## Final dependency matrix

| Area | Version |
|---|---:|
| Angular framework / compiler-cli | 14.2.12 |
| Angular CLI / ngtools-webpack | 14.2.13 |
| TypeScript / RxJS / Zone.js | 4.6.4 / 6.5.5 / 0.11.4 |
| ng-bootstrap / Bootstrap / Popper | 13.1.1 / 5.2.0 / 2.11.5 |
| Webpack / CLI / dev server | 5.54.0 / 4.10.0 / 4.15.2 |
| Jest / preset / ts-jest / jasmine runner | 28.1.3 / 12.2.6 / 28.0.8 / 28.1.3 |
| `@types/jest` / ng-jhipster | 27.5.2 / 0.12.0 |
| Node / npm / lockfile | 14.21.3 / 6.14.18 / v1 |

`node-releases` remains a **PRE-EXISTING TRANSITIVE ENGINE DEBT**: its Node 18
engine metadata did not prevent npm, Browserslist, Angular CLI or the validated
build from working under the maintained Node 14 migration runtime. No pin was
added.

## Compatibility bridges

Angular 14 typed reactive forms exposed 44 TS2322 diagnostics in ten historical
form components. They retain legacy semantics through the deliberate
`UntypedFormBuilder` bridge; no typed-forms modernization was performed. The
matching ten specs provide the same dependency. Validators, initial values,
mapping, service calls and assertions remain unchanged.

The Angular compatibility compiler processed legacy View Engine libraries,
including `ng-jhipster`, ngx-translate, ngx-cookie, ngx-webstorage,
ngx-infinite-scroll and FontAwesome.

## Validation

- `npm ci --ignore-scripts`: reproducible with lockfile v1.
- `ngcc`: successful; `ng-jhipster` processed.
- `ngc`: zero diagnostics.
- Jest: 60 suites, 181 tests, zero failures.
- Production build: Webpack 5.54.0, 73 artifacts.
- Component-style `[object Module]` occurrences: zero; `css-loader` keeps
  `esModule: false` in the development and production configurations.
- Static smoke for `/`, `index.html`, main JavaScript and CSS: successful.

## Visual validation

The user validated all targeted regression groups against the generated build:

| Area | Status |
|---|---|
| A — Public navigation | USER VALIDATED |
| B — Authenticated navigation | USER VALIDATED |
| C — Modals | USER VALIDATED |
| D — Tables, pagination and badges | USER VALIDATED |
| E — Forms | USER VALIDATED |
| F — Audits | USER VALIDATED |
| G — Tooltip and datepicker | USER VALIDATED |
| H — Responsive layouts | USER VALIDATED |
| Password strength | USER VALIDATED |

The password-strength bar remains five horizontal segments without bullets and
keeps its colour transitions. No real deletion or form save was performed.

## Deferred and out of scope

- F-B ESLint: **DEFERRED**.
- F-F Protractor: **NON-BLOCKING**.
- H2 SSL translation: **PRE-I18N**.
- Audits A1 native date control: **NATIVE**.
- Typed-forms modernization: deferred.
- Official Angular migrations: 8G5.

## Conclusion

8G2 is technically green and visually user validated, ready for integration.
