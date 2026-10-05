# Stage 8H2 — Angular 15 coordinated dependency graph

## Base

`master`: `1a7c1352b3c5b825e532a7e2d579545486d88769`

## Objetivo

Establecer el grafo coordinado de dependencias Angular 15 antes de ejecutar las migraciones oficiales. La etapa 8H1 ya integró TypeScript `4.8.4`; 8H2 modifica exclusivamente dependencias. Las migraciones oficiales corresponden a 8H3 y la validación integral a 8H4.

## Dependency changes

| Package | Before | After |
|---|---:|---:|
| `@angular/common` | 14.2.12 | 15.2.10 |
| `@angular/compiler` | 14.2.12 | 15.2.10 |
| `@angular/core` | 14.2.12 | 15.2.10 |
| `@angular/forms` | 14.2.12 | 15.2.10 |
| `@angular/localize` | 14.2.12 | 15.2.10 |
| `@angular/platform-browser` | 14.2.12 | 15.2.10 |
| `@angular/platform-browser-dynamic` | 14.2.12 | 15.2.10 |
| `@angular/router` | 14.2.12 | 15.2.10 |
| `@angular/cli` | 14.2.13 | 15.2.11 |
| `@angular/compiler-cli` | 14.2.12 | 15.2.10 |
| `@ngtools/webpack` | 14.2.13 | 15.2.11 |
| `@ng-bootstrap/ng-bootstrap` | 13.1.1 | 14.2.0 |
| `bootstrap` | 5.2.0 | 5.2.3 |
| `@popperjs/core` | 2.11.5 | 2.11.6 |
| `tslib` | 2.0.3 | 2.3.1 |

## Preserved dependencies

- TypeScript `4.8.4`.
- RxJS `6.5.5`.
- Zone `0.11.4`.
- Webpack `5.54.0`.
- Jest 28.
- `ng-jhipster` `0.12.0`.
- `@types/babel__traverse` `7.20.5`.
- Moment `2.24.0`.

## Runtime

- Node `14.21.3`.
- npm `6.14.18`.
- lockfile v1.

## Install

- `npm install --ignore-scripts`: GREEN.
- `npm ci --ignore-scripts`: GREEN.
- lockfile drift: NONE.
- `postinstall`: NOT EXECUTED.

## Peer graph

Los peers principales de Angular 15, TypeScript, ngtools, ng-bootstrap, Bootstrap y Popper son compatibles.

`npm ls` mantiene exit `1` con la clasificación EXPECTED LEGACY PEER DEBT — NON-BLOCKING. Los peers conflictivos son históricos de `ng-jhipster`, `ngx-webstorage`, `codelyzer`, ESLint/tooling y plugins Webpack antiguos. No existe conflicto nuevo bloqueante entre Angular 15, TypeScript, ngtools, ng-bootstrap, Bootstrap o Popper.

## ngcc

GREEN.

`ng-jhipster`: processed successfully.

Clasificación: TEMPORARY ANGULAR 15 VIEW ENGINE COMPATIBILITY CONFIRMED.

`ng-jhipster` y ngcc siguen siendo deuda estratégica que debe resolverse antes de Angular 16.

## ngc

- exit: 0.
- diagnostics: 0.

## ng-bootstrap compatibility

La compilación confirma los usos actuales de `NgbModule`, `NgbModal`, `NgbModalRef`, `NgbActiveModal`, `NgbPaginationConfig`, `NgbDateAdapter`, `NgbDateStruct`, `NgbDatepickerConfig`, `ngbTooltip`, `ngbDropdown`, `ngbCollapse` y `ngb-pagination`.

## Moment date adapter

`NgbDateMomentAdapter`: COMPATIBLE BY COMPILATION.

## Webpack

- Webpack `5.54.0` retained.
- Peer de `@ngtools/webpack` `15.2.11`: compatible.
- Configuración Webpack personalizada: unchanged.

## Jest

- unchanged.
- Full suite: NOT EXECUTED IN 8H2 BY DESIGN.

## Official Angular migrations

NOT EXECUTED.

Scheduled: 8H3.

## Validation pending

- Full Jest: 8H4.
- Production build: 8H4.
- Static smoke: 8H4.
- Targeted visual: 8H4.

## Visual validation

PENDING 8H4 — TARGETED.

Motivo: `@ng-bootstrap/ng-bootstrap` `13.1.1` a `14.2.0` y Bootstrap `5.2.0` a `5.2.3`.

## Deferred debt

- Desacoplar `ng-jhipster` antes de Angular 16.
- RxJS 7.
- Typed forms.
- ESLint.
- Protractor.
- Sustitución de Moment.
- Standalone APIs.
- Modernización de Node.

## Conclusion

8H2: ANGULAR 15 DEPENDENCY GRAPH GREEN, READY FOR OFFICIAL MIGRATIONS.
