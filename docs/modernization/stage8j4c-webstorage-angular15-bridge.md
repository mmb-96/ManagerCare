# Etapa 8J4C — compatibilidad de ngx-webstorage con Angular 15

## Alcance y base

Base: `8c10adffe71c03f73a11f3cb25e16aa32ea2ecf8`.
Rama: `modernization/08j4c-webstorage-angular15-bridge`.

8J4A seleccionó 11.1.1; 8J4B congeló los contratos de almacenamiento y
autenticación. 8J4C actualiza exclusivamente ngx-webstorage y añade su inclusión
al linker existente. No requirió adaptar código fuente, tests, backend ni CI.
Este cierre registra resultados ya aceptados, sin repetir gates.

## Versiones y grafo de paquetes

| Componente | Antes | Después |
|---|---|---|
| ngx-webstorage | 5.0.0 | 11.1.1 |
| Angular | 15.2.10 | Sin cambios |
| TypeScript | 4.8.4 | Sin cambios |
| RxJS | 6.5.5 | Sin cambios |
| tslib raíz | 2.3.1 | Sin cambios |

Reconfirmación estructural durante el cierre: 3419 → 3419 nodos recursivos,
1505 → 1505 de primer nivel, una versión modificada, cero nodos añadidos,
eliminados o modificados ajenos al objetivo; lockfileVersion 1. La comparación
profunda y textual de package/lock, incluidos los finales de línea, pasó.
package.json solo cambia ngx-webstorage; el lock solo modifica su nodo exacto.
No hay tslib anidado bajo ngx-webstorage.

## Formato del paquete y linker

El paquete 11.1.1 oficial pasó la verificación SHA-512 antes de extraerse.
Contiene 64 archivos y formato partial-Ivy: 19 declaraciones `ɵɵngDeclare*`
en el FESM inspeccionado, sin `ɵɵdefine*` original. No contiene metadata
View Engine, archivos `.metadata.json`, backups `.__ivy_ngcc_bak` ni marca
`__processed_by_ivy_ngcc__`. ngx-webstorage ya no requiere ngcc.

Sus peers common/core `^15.0.0` están satisfechos por 15.2.10 y su dependencia
tslib `^2.0.0` por 2.3.1; no declara engines.

En `webpack/webpack.common.js` se añadió únicamente ngx-webstorage al include
de la regla Babel linker que ya incluía @angular, @ng-bootstrap y
@fortawesome/angular-fontawesome. Loader, plugin, options, resolve,
AngularWebpackPlugin, otras rules e includes permanecen intactos.
El objetivo quedó enlazado: cero declaraciones sin enlazar y cero contenido
View Engine 5.0.0 activo en los bundles inspeccionados. En desarrollo se
identificó un módulo objetivo con `ɵɵdefineNgModule`, sin workaround JIT.

## Reproducibilidad desde instalación limpia

Node 14.21.3 y npm 6.14.18 portables, con PATH limitado al proceso. Se verificó
el ZIP oficial mediante SHA-256
`47CFB919BB86AB681369636A9CB925E2BD61991AAD1638B2E38E61EC956796A6`;
la extracción completa incluía node-gyp. No se modificó el entorno persistente.

| Ejecución aislada | Resultado | Paquetes | Tiempo npm | Tiempo total |
|---|---|---:|---:|---:|
| Instalación limpia online | exit 0 | 3353 | 77.374 s | 78.454 s |
| Segunda instalación limpia offline | exit 0 | 3353 | 64.147 s | 65.293 s |

Ambas usaron `npm ci --ignore-scripts --no-audit --no-fund`; la segunda añadió
`--offline`, después de retirar únicamente node_modules de la instalación
aislada. No hubo postinstall ni actualización WebDriver. Online solo contactó
registry.npmjs.org; offline registró cero peticiones HTTP. Los hashes de
package.json y package-lock.json permanecieron intactos en ambas ejecuciones.

`npm ls ngx-webstorage tslib --all` devolvió exit 1 por conflictos históricos
ajenos: codelyzer 5.2.0 pide Angular anterior a 10 y, junto con
@typescript-eslint/eslint-plugin-tslint 2.11.0, pide tslint 5 frente al 6
instalado. El objetivo 11.1.1 y tslib 2.3.1 deduplicado son correctos;
no se corrigieron esas deudas ni se clasificó el objetivo como inválido.

Se respaldaron los 132 archivos del paquete 5.0.0 con hashes coincidentes y
se sustituyó solo node_modules/ngx-webstorage desde la instalación verificada.
El estado físico final conserva 11.1.1 y tslib raíz 2.3.1, sin paquete antiguo
activo, metadata legacy, backups ngcc ni tslib anidado.

## Caracterización inmutable y contratos preservados

Los siete archivos de caracterización 8J4B conservaron sus SHA-256: 7/7
coinciden antes y después de los gates y de la limpieza. No se cambiaron
expectations, fixtures sustantivos ni tests para adaptarlos a 11.1.1.

| Clave lógica | Clave física | Destino | Codificación |
|---|---|---|---|
| authenticationToken | jhi-authenticationtoken | Local con rememberMe; Session sin rememberMe | Cadena JSON |
| locale | jhi-locale | Session | Cadena JSON |
| previousUrl | jhi-previousurl | Session | Cadena JSON |

Se preservan prefijo `jhi`, separador `-`, caseSensitive false y normalización
a minúsculas. La matriz focal conserva:

- Escritura JSON y lectura de datos raw preexistentes antes de crear el servicio.
- Clave ausente → null; JSON inválido → null y warning; clear y clear de clave ausente.
- rememberMe true → Local; false → Session; el almacén opuesto no se altera.
- Selección Local → Session → cadena vacía cuando no hay token.
- Logout diferido hasta la suscripción y limpieza de ambos almacenes.
- Authorization para URLs admitidas y exclusión de URL absoluta externa.
- Locale de sesión, precedencia/fallback de AccountService y contrato de Navbar.
- Limpieza de previousUrl antes de navegar.

El consumidor Swagger conserva sin cambios su clave directa y JSON.parse.
La caracterización del escritor 5.0.0 y la lectura/escritura equivalente en
11.1.1 demuestran compatibilidad de formato: la migración del almacenamiento
no fuerza logout por sí misma. Esto no cambia ni garantiza la vigencia del JWT.

## Validación automatizada aceptada

| Gate | Resultado | Duración registrada |
|---|---|---|
| ngc | Verde; 0 diagnostics; exit 0 | 20.152 s |
| Jest focal | 6 suites / 42 tests / 0 fallos / 0 omitidos | Jest 22.132 s; total 36.297 s |
| Jest completo | 83 suites / 305 tests / 0 fallos / 0 omitidos | Jest 52.210 s; total 56.906 s |
| Webpack producción | Verde; exit 0; 73 artefactos; 9 warnings | 84.479 s |
| Linker | Objetivo enlazado; 0 declaraciones pendientes | Inspección de bundles |
| Validación estática | Verde | Inspección del build |
| Webpack desarrollo aislado | Verde; exit 0; 7 warnings | 40.229 s |

El focal comprende webstorage-contract (11), auth-jwt (6), auth.interceptor
(5), state-storage (3), navbar (1) y account (16).
Baseline frontend vigente: 83 suites / 305 tests / 0 fallos.

Estática: 8 referencias de index y 53 de Workbox, todas presentes;
i18n/es.json válido, assets presentes y cero `[object Module]`.

Desarrollo canónico encontró únicamente el F-B histórico de eslint-loader
en logs.component.ts: `Cannot read property 'map' of undefined` (exit 1).
Se usó aislamiento temporal exclusivamente dentro de node_modules, sin cambio
versionado. Durante el cierre se restauró el original y se verificó SHA-256:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
El aislamiento está retirado; F-B permanece diferido, no como regresión 8J4C.

Warnings no bloqueantes: testURL/ts-jest esModuleInterop, cierre forzado de un
worker Jest, warnings legacy del build y conflicto DefinePlugin de
`process.env.NODE_ENV`. No se amplió el alcance para corregirlos.

## Recuperación y validación del entorno efímero

Docker Linux engine se reinició durante la etapa. Se reutilizó el contenedor
managercare-8j4c-v1-postgres, inicialmente sin recrearlo. Su contenido tmpfs
anterior había desaparecido tras la parada: pérdida esperada de un entorno
efímero, no regresión de aplicación. Se prepararon de nuevo únicamente un
administrador sintético y un Tipo sintético, sin duplicados.

Estado validado: PostgreSQL 17.11 en tmpfs, sin volumen persistente;
backend UP/200, frontend 200, i18n 200/JSON válido, lock Liquibase libre,
login 200, /api/account 200 y rol administrador confirmado.

## Aceptación manual

| Prueba | Resultado y evidencia |
|---|---|
| W1, rememberMe false | Aprobada: clave en Session, ausente en Local; flujo autenticado correcto |
| W2, rememberMe true | Aprobada: clave en Local, ausente en Session; autenticación conservada tras recarga |
| W3, logout | Aprobada: clave ausente en ambos almacenes; UI deslogueada |
| W4, locale | Aceptada con recorrido manual no disponible: la UI no expone selector de idioma; contrato automatizado verde |
| W5, previousUrl | Aprobada: acceso deslogueado a User Management, login, retorno automático y clave consumida ausente |
| W6, Console/Network/Storage | Aprobada: sin nuevos errores observados |

W4 no representa un cambio de idioma manual realizado. Su evidencia procede
de jhi-locale, Session, JSON, Navbar y precedencia/fallback de AccountService.
No se observaron regresiones nuevas de DI, JSON parsing, linker, chunks,
assets, i18n ni HTTP inesperado.

## Seguridad y limpieza

No se copiaron ni registraron valores JWT, Authorization, contraseñas, hashes
de credenciales ni claves de activación. En Storage se inspeccionaron solo
nombres de claves, ubicación y presencia/ausencia.

Se detuvieron exclusivamente los procesos backend y frontend de 8J4C y se
eliminó su contenedor tmpfs, descartando los datos sintéticos. No tenía
volúmenes persistentes. Los puertos 8080, 9000, 9060, 15433 y 3001 quedaron libres.
Se retiró exclusivamente el directorio temporal 8J4C: acceso manual, respaldo
5.0.0, instalaciones y caché aisladas, tarball, metadata, snapshots, hashes,
scripts, logs, helpers y copia portable Node de esta etapa.
Se conservaron node_modules general, ngx-webstorage 11.1.1 activo, tslib raíz,
Java, cachés globales, recursos Docker ajenos y ramas readiness.

## NGCC y hoja de ruta

Blockers ngcc: 3 → 2. Restan @ngx-translate/core 11.0.1 y
@ngx-translate/http-loader 4.0.0. NGCC sigue siendo necesario y Angular 16
todavía no está preparado.

| Etapa | Resultado |
|---|---|
| 8J0 | Inventario completado |
| 8J1A / 8J1B | Readiness completada / infinite-scroll retirado e integrado |
| 8J2A / 8J2B | Readiness completada / ngx-cookie retirado e integrado |
| 8J3A / 8J3B | Readiness completada / compatibilidad FontAwesome Angular 15 integrada |
| 8J4A | Selección del objetivo webstorage completada |
| 8J4B | Contratos storage/auth integrados |
| 8J4C | Compatibilidad ngx-webstorage Angular 15 completada para integración |

Progresión de blockers: 6 → 5 → 4 → 3 → 2.
La siguiente unidad es 8J5A: investigación conjunta de readiness y objetivo
Angular 15 para ngx-translate core/http-loader. No se ha iniciado ni elegido
versión o estrategia. Después seguirán readiness sin ngcc, modernización de
Node/toolchain y readiness Angular 16; no se salta directamente a Angular 16.

## Conclusión

Compatibilidad ngx-webstorage Angular 15 completada. Blocker ngcc de webstorage
eliminado; contratos storage/auth preservados. NGCC sigue siendo requerido y
Angular 16 no está preparado. Backend CI posterior a la integración es una
validación adicional y no sustituye ngc, Jest, Webpack ni W1–W6 ya aceptados.
