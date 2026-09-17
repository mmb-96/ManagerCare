# Etapa 8D-v2 — Angular 10.2.5 a Angular 11.2

## Base

- Base Git: `75846e15e596ab16d652de1f809032e4711eb4b1`.
- Angular 10.2.5, CLI/ngtools 10.2.4 y TypeScript 3.9.10.
- Node 12.16.1 y npm 6.14.2; Webpack 4 y salida en
  `target/classes/static`.

## Resultado

| Componente | Antes | Después |
| --- | ---: | ---: |
| Angular framework y `@angular/localize` | 10.2.5 | 11.2.14 |
| Angular CLI / `@ngtools/webpack` | 10.2.4 | 11.2.19 |
| `@angular/compiler-cli` | 10.2.5 | 11.2.14 |
| TypeScript | 3.9.10 | 4.0.8 |
| `@ng-bootstrap/ng-bootstrap` | 7.0.0 | 9.1.3 |
| RxJS | 6.5.5 | 6.5.5 |
| Zone.js | 0.10.3 | 0.10.3 |
| tslib | 2.0.3 | 2.0.3 |

La combinación conserva Node 12 y Webpack 4. Angular 11.2 es compatible con
Node 12.11+ y TypeScript 4.0--4.1; ng-bootstrap 9.x corresponde a Angular 11.
El lockfile continúa usando `lockfileVersion: 1`.

## Lint

Se mantiene la decisión de
[stage8d1-lint-decoupling.md](stage8d1-lint-decoupling.md): F-B legacy lint
está **DEFERRED**. No se modificaron `.eslintrc.json`,
`@typescript-eslint`, reglas ni código para recuperar lint.

El servidor de desarrollo Webpack aún carga el `eslint-loader` histórico y
falla con su parser legacy al usar TypeScript 4.0.8. Esto pertenece
exactamente a la deuda F-B diferida; no afecta al compilador Angular, los
tests ni el build de producción y no se corrigió en esta etapa.

## Migrations y código

No se aplicó una migration automática ni fue necesario cambiar archivos
TypeScript, HTML, tsconfig, Webpack o JHipster. El cambio se limitó a las
dependencias Angular 11 y sus peers directos. `ngcc` procesó exclusivamente
`node_modules`; el segundo build demostró que `@ngtools/webpack` vuelve a
ejecutarlo automáticamente tras un `npm ci` limpio.

## Gates

### F-A — instalación reproducible

`npm ci` se ejecutó dos veces desde `node_modules` vacío usando Node 12.16.1
y npm 6.14.2. Ni `package.json` ni `package-lock.json` cambiaron durante las
instalaciones. El `postinstall` histórico reconstruyó WebDriver; no se usó
ningún comando manual de actualización.

### F-BT — compilación Angular y TypeScript

La primera ejecución de `ngc` detectó dependencias Ivy todavía no procesadas.
Tras ejecutar el `ngcc` local de Angular 11 sobre `node_modules`,
`ngc -p tsconfig.app.json` terminó sin errores.

| Categoría | Resultado |
| --- | ---: |
| TypeScript | 0 errores |
| Angular compiler | 0 errores |
| Template compiler | 0 errores |
| Ivy / ngcc bloqueantes | 0 |

Los paquetes procesados incluyen Angular framework, ng-bootstrap 9.1.3,
ng-jhipster, ngx-translate, ngx-webstorage, ngx-cookie, ngx-infinite-scroll y
Font Awesome.

### F-C — unit tests

Jest directo, sin ejecutar F-B:

- 60 suites correctas;
- 181 tests correctos;
- 0 fallos.

### F-D — build de producción

El build histórico Webpack 4 terminó correctamente dos veces, generando 69
archivos en `target/classes/static`. El segundo build se ejecutó inmediatamente
después del segundo `npm ci` limpio y procesó ngcc automáticamente. El bundle
principal se mantiene aproximadamente en 1.09 MiB.

### F-E — contrato y smoke

La revisión estática preservó `/api/authenticate`, `/api/account`,
`Authorization: Bearer`, JWT, 401/403, `X-Total-Count`, `Link`,
`X-managerCareApp-alert`, `X-managerCareApp-params` y el contrato Problem.

El artefacto de producción servido temporalmente devolvió HTTP 200 y
referenció el bundle principal. No se inició backend. El intento de servidor
de desarrollo falla porque `eslint-loader` legacy no es compatible con
TypeScript 4.0.8. Corresponde a la deuda F-B **DEFERRED**: no invalida
F-BT/F-C/F-D/F-E, no se aplicó ningún workaround y no se modificó ESLint.

### F-DIFF — revisión estricta

| Archivo | Cambio | Motivo | Funcional |
| --- | --- | --- | --- |
| `package.json` | Angular 10 a 11 y peers necesarios | Migración framework | No funcional por sí mismo |
| `package-lock.json` | Grafo regenerado con npm 6 | Resolver Angular 11 y peers | No |
| este documento | Evidencia de la etapa | Documentación | No |

El diff se revisó explícitamente buscando `eslint-disable`, `@ts-ignore`,
`@ts-nocheck`, `: any`, `<any>`, `xit(`, `xdescribe(` y `.skip`; no se
introdujo ningún workaround ni test deshabilitado por la migración.

No hay cambios de código productivo ni HTML, backend, CI, ESLint, Webpack
major, Protractor, Moment ni JHipster funcional. F-DIFF queda ✅.

### F-F — E2E

Continúa no bloqueante: Protractor/WebDriver legado sigue condicionado por la
incompatibilidad conocida entre ChromeDriver 114 y Chrome 153.

## Warnings

Heredados, sin corrección en esta etapa:

- `fsevents` intenta compilación opcional en Windows sin Visual Studio;
- `caniuse-lite` está desactualizado;
- límites de tamaño de bundles Webpack;
- ts-jest 24 no declara soporte formal para TypeScript 4.0.8;
- recomendación ts-jest sobre `esModuleInterop`.

No se añadió configuración ni workaround para ninguno.

## Dependabot

Baseline previa al merge: 20 críticas, 113 altas, 79 medias y 22 bajas
(234 en total; 133 críticas/altas; 60 paquetes únicos críticas/altas). Esta
etapa no usa `npm audit` como sustituto de Dependabot.

## Deuda restante

1. Angular 11 a 12, solo tras revisión de esta etapa.
2. Modernización separada de ESLint.
3. Webpack, Protractor/WebDriver, JHipster frontend y Moment.
