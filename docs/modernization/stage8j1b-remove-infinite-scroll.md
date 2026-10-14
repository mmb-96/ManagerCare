# Etapa 8J1B — retirada de ngx-infinite-scroll

## Alcance y base

Rama: `modernization/08j1b-remove-infinite-scroll`.
Base: `8abdf828b1268fe2be736ae23727e6b564059932`.

Retirada exclusiva de ngx-infinite-scroll 8.0.1, sin reemplazo ni nuevas
funcionalidades de scrolling. No cambian tests, otros sources, Webpack,
backend, CI ni configuración ESLint versionada.

## Hallazgos de readiness

8J1A confirmó un único import productivo y una reexportación en SharedLibs.
Selectors, inputs, outputs y servicios consumidores: 0. Tests funcionales
específicos: 0. Providers globales: 0. Efectos de importación necesarios: ninguno
encontrado. Transitivas exclusivas: 0. Reemplazo no requerido.

La reexportación hacía disponible el módulo, pero no demostraba uso funcional.
La inspección incluyó los tres selectors reales y los diez inputs del paquete,
templates externos e inline, hosts de tests y la superficie pública instalada.

## Cambio de fuentes

En `src/main/webapp/app/shared/shared-libs.module.ts` se retiraron exclusivamente:

- `import { InfiniteScrollModule } from 'ngx-infinite-scroll';`
- La entrada `InfiniteScrollModule` del array `exports`.

Todos los demás imports/exports permanecen intactos. No se cambia ningún otro
archivo fuente ni se modifica paginación.

## Mutación del grafo

Patch textual mínimo más invariantes estructurales; no npm uninstall en workspace.
package.json: una línea retirada, exclusivamente la dependencia 8.0.1.
package-lock.json: ocho líneas retiradas, exclusivamente el nodo del paquete.
Diff funcional total: tres archivos y once eliminaciones, sin reformateo.

| Invariante | Antes | Después |
| --- | ---: | ---: |
| Nodos recursivos | 3421 | 3420 |
| Entradas de primer nivel | 1507 | 1506 |
| lockfileVersion | 1 | 1 |
| Nodos retirados | — | 1: ngx-infinite-scroll |
| Transitivas exclusivas retiradas | — | 0 |
| Nodos añadidos | — | 0 |
| Nodos conservados modificados | — | 0 |

JSON válido en ambos archivos. Igualdad profunda con los originales menos la
dependencia/nodo: PASS. Invariantes textuales y EOL: PASS. SharedLibs coincide
exactamente con su original menos las dos líneas autorizadas.

## OpenCollective conservado

`opencollective-postinstall 2.0.2` permanece instalado y en el lock.
Husky continúa requiriéndolo. No se modifican ninguno de esos nodos ni sus
propiedades. No se elimina ninguna dependencia compartida.

## Reproducción limpia

Node 14.21.3 / npm 6.14.18 oficiales portables, copias de los package files en
un workspace temporal limpio, sin copiar node_modules real:

```text
npm ci --ignore-scripts --offline --no-audit --no-fund
```

Código 0. Offline: sí. Scripts desactivados: sí. Red durante npm ci: no.
Duración total: 83,295 s; npm informó 3354 paquetes en 82,058 s.
Los hashes de package.json y package-lock.json permanecieron intactos.
ngx-infinite-scroll ausente, incluidas instalaciones anidadas: 0.
OpenCollective y Husky presentes. No se ejecutaron gates funcionales en ese TEMP.

## Workspace funcional

La instalación original se respaldó en TEMP y se verificaron sus 37 archivos.
Se retiró únicamente node_modules/ngx-infinite-scroll. OpenCollective conservado.
El paquete estuvo físicamente ausente durante ngc, Jest, Webpack y runtime;
no se restauró para superar gates. Referencias activas en src: 0.

## Validación automatizada aceptada

| Gate | Resultado real |
| --- | --- |
| ngc | Código 0; 0 diagnósticos |
| Host público SharedLibs | 1 suite / 1 test / 0 fallos; 13,649 s |
| Smoke adicional de listas | No ejecutado; opcional, no requerido |
| Jest completo | 78 suites / 278 tests / 0 fallos; 68,081 s |
| Webpack productivo | Código 0; compilación 81,687 s; 9 warnings |
| Artefactos productivos | 73, igual a baseline |
| Contenido del paquete/módulo en artefactos | 0 |
| Index | 7 referencias / 0 ausentes |
| Workbox | 53 referencias / 0 ausentes |
| i18n/es.json | JSON válido |
| Assets referenciados | Presentes |
| [object Module] | 0 |
| Webpack development con aislamiento autorizado | Código 0; compilación 41,846 s; 7 warnings |

Baseline Jest conservada: 78/278/0. No se cambian tests ni expectativas.
No se repiten gates durante el cierre.

Dev canónico reprodujo únicamente el F-B conocido: parser eslint-loader en
logs.component.ts, `Cannot read property 'map' of undefined`. Se respaldó y
aisló temporalmente el loader dentro de node_modules, sin cambios versionados.
F-B sigue siendo deuda independiente.

## Aceptación manual

El usuario aprobó explícitamente estos resultados; no son automatizados:

| Comprobación | Resultado y alcance |
| --- | --- |
| I1 — Bootstrap/login | PASS: SPA, login, español y ausencia de nuevos errores observados de módulos/providers |
| I2 — Tipo | PASS: lista renderizada, SharedModule correcto, sin ausencia de directivas/módulos |
| I3 — User Management/paginación | PASS: item count y cambio de página correctos |
| I4 — Console/Network | PASS: sin nuevas regresiones observadas de módulos, DI, templates, chunks, assets, i18n o red |

## Relación con paginación

La paginación no utiliza ngx-infinite-scroll. Mantiene PaginationUtil local,
JhiItemCount local, ngb-pagination y parámetros page/size/sort.
Impacto observado sobre 8I1: ninguno. No se cambia su implementación.

## Runtime preparatorio

Java 21.0.12.1 y PostgreSQL 17.11, contenedor exclusivo
`managercare-8j1b-v1-postgres`, almacenamiento tmpfs y ningún volumen persistente.
Datos y cuenta exclusivamente sintéticos.

Backend: 200/UP. Frontend: 200. i18n: 200 y JSON válido.
Liquibase: 23 changesets con contexto dev y lock libre.
Login/account correctos; Tipo sintético preparado.
User Management: 25 usuarios, páginas 0 y 1 comprobadas por HTTP.
No se documentan valores de acceso, claves ni tokens.

## Tooling y warnings

ZIP Node oficial verificado frente a SHASUMS256 mediante SHA-256:
`47CFB919BB86AB681369636A9CB925E2BD61991AAD1638B2E38E61EC956796A6`.
node-gyp presente. PATH exclusivamente temporal; entorno persistente intacto.

`DefinePlugin — Conflicting values for 'process.env.NODE_ENV'` permanece como
preexistente, no bloqueante y fuera de alcance. Otros warnings legacy de Jest,
Browserslist, Babel y tamaños Webpack no se corrigen en esta etapa.

## Limpieza

Frontend/backend y auxiliares exclusivos detenidos. Contenedor PostgreSQL
eliminado y datos tmpfs descartados, sin volumen persistente. Puertos temporales
libres. No se ejecuta prune ni limpieza global.

eslint-loader original restaurado con SHA-256 idéntico al respaldo:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
Aislamiento temporal retirado; F-B diferido.

Retirados exclusivamente los temporales 8J1B: rollback del paquete, instalación
limpia, runtime y credenciales, logs/XML, scripts/verificadores, Node portable,
originales de referencia y respaldo del loader tras comprobar restauración.
No se restaura ngx-infinite-scroll. Se preservan node_modules general, Java,
caches globales, instalaciones y Docker ajenos.

## Blockers ngcc restantes

El recuento pasa de seis a cinco:

| Paquete | Versión preservada |
| --- | --- |
| @fortawesome/angular-fontawesome | 0.6.0 |
| @ngx-translate/core | 11.0.1 |
| @ngx-translate/http-loader | 4.0.0 |
| ngx-cookie | 4.0.2 |
| ngx-webstorage | 5.0.0 |

## Roadmap y conclusión

8J0: inventario y secuenciación completados. 8J1A: readiness completada.
8J1B: retirada de ngx-infinite-scroll validada y aceptada para integración.
Sin pérdida de funcionalidad consumida y sin reemplazo.

ngcc sigue requerido; Angular 16 no está preparado.
La siguiente etapa prevista es readiness de ngx-cookie. **No iniciada.**
