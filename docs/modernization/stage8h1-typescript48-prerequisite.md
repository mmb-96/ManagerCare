# Stage 8H1 — TypeScript 4.8.4 prerequisite

## Base

`master`: `b93846f8969a5dfca679658c15524b1a3302391e`

## Objetivo

Aislar el prerrequisito TypeScript necesario para Angular 15: `4.6.4` a `4.8.4`, sin actualizar todavía Angular ni otras dependencias del grafo de 8H2.

## Scope

Cambios versionados: `package.json` y `package-lock.json`. No hay cambios de source.

## Dependency change

- TypeScript: `4.6.4` a `4.8.4`.
- `@types/babel__traverse`: `7.20.5` retained.

## Runtime

- Node: `14.21.3`.
- npm: `6.14.18`.
- lockfile: v1.

## Reproducible install

`npm ci --ignore-scripts`: GREEN.

`postinstall`: NOT EXECUTED.

## ngcc

GREEN.

`ng-jhipster`: processed successfully.

## ngc

0 diagnostics.

## Jest

60 suites, 181 tests y 0 failures.

## Production build

- Webpack: `5.54.0`.
- Angular: `14.2.12`.
- ngtools: `14.2.13`.
- TypeScript: `4.8.4`.
- artifact count: 73.
- result: GREEN.

## Runtime PATH incident

El primer build quedó bloqueado antes de iniciar Webpack porque el `PATH` del proceso no contenía el npm portable correspondiente.

Clasificación: RUNTIME PATH INFRASTRUCTURE FAILURE.

Resolución: `PATH` temporal del proceso apuntando al runtime portable Node `14.21.3` / npm `6.14.18`. No se persistió.

Build posterior: GREEN.

## SCSS

- `[object Module]`: 0.
- `css-loader esModule:false`: preserved.

## Static smoke

| Resource | Status |
|---|---:|
| `/` | 200 |
| `/index.html` | 200 |
| main JS | 200 |
| main CSS | 200 |
| SPA fallback | 200 |

## Visual validation

NOT REQUIRED — TOOLCHAIN-ONLY CHANGE.

## Compatibility conclusion

TypeScript `4.8.4` + Angular `14.2.12` + `@ngtools/webpack` `14.2.13` + Webpack `5.54.0`: COMPATIBLE.

## Deferred

- Angular 15: 8H2.
- ng-bootstrap 14: 8H2.
- Bootstrap/Popper alignment: 8H2.
- tslib Angular 15 requirement: 8H2.
- RxJS 7: deferred.
- typed forms: deferred.
- ESLint: deferred.
- Protractor: non-blocking.
- Moment: deferred.
- ng-jhipster decoupling: future stage before Angular 16.

## Conclusion

8H1: TECHNICALLY GREEN, READY FOR INTEGRATION.
