# Etapa 8J3B — puente FontAwesome para Angular 15

## Alcance y base

Base: `2b1d1e7e1c76d42eac474c44d4f817f5851bb362`.
Rama: `modernization/08j3b-fontawesome-angular15-bridge`.

La investigación 8J3A seleccionó un puente compatible con Angular 15:
`@fortawesome/angular-fontawesome` 0.12.1 y SVG core 1.2.27, conservando
Font Awesome 5. No fue necesario actualizar iconos, common-types ni tslib raíz.
Angular permanece en 15.2.10. No se modificaron fuentes, templates, tests,
backend ni CI. Esta documentación registra resultados previamente aceptados;
los gates no se repitieron durante el cierre.

## Versiones y grafo de paquetes

| Paquete | Antes | Después |
|---|---|---|
| `@fortawesome/angular-fontawesome` | 0.6.0 | 0.12.1 |
| `@fortawesome/fontawesome-svg-core` | 1.2.26 | 1.2.27 |
| `@fortawesome/free-solid-svg-icons` | 5.12.0 | 5.12.0 |
| `@fortawesome/fontawesome-common-types` | 0.2.27 | 0.2.27 |
| `tslib` raíz | 2.3.1 | 2.3.1 |
| `@fortawesome/angular-fontawesome/node_modules/tslib` | Ausente | 2.4.1 |

`package.json` cambia únicamente las dos versiones FontAwesome autorizadas.
En `package-lock.json`: dos nodos existentes cambiados, uno añadido, cero
eliminados y cero cambios ajenos. Nodos recursivos: 3418 → 3419; primer nivel:
1505 → 1505; `lockfileVersion`: 1. Invariantes profundas de ambos JSON,
inclusión mínima del linker y conservación textual/EOL: correctas.
Los hashes de los 1951 archivos de paquetes preservados no cambiaron.
No se migró a Font Awesome 6.

## Formato partial-Ivy y linker Webpack

El wrapper 0.12.1 contiene declaraciones partial-Ivy. No contiene
`.metadata.json`, metadatos View Engine ni archivos `.__ivy_ngcc_bak`.
El wrapper ya no necesita ngcc, pero sí el linker, que quedó validado.

La regla Babel linker existente en `webpack/webpack.common.js` ya incluía
`@angular` y `@ng-bootstrap`. Se añadió únicamente el patrón de
`@fortawesome/angular-fontawesome`. No cambiaron loader, plugin Babel,
opciones, `AngularWebpackPlugin`, exclusiones ni las demás reglas.

En la salida runtime: cero declaraciones partial-Ivy del objetivo sin enlazar,
cero módulos activos del wrapper antiguo y cero contenido View Engine antiguo.

## Reproducibilidad y workspace físico

Se utilizó Node 14.21.3/npm 6.14.18 portable oficial con SHA-256 verificado,
sin modificar el entorno persistente.

| Instalación limpia controlada | Resultado | Duración | Scripts | Hashes de ambos package files |
|---|---|---:|---|---|
| Primera, online; solo `registry.npmjs.org` | Código 0 | 156,107 s | Deshabilitados | Sin cambios |
| Segunda, offline | Código 0 | 127,686 s | Deshabilitados | Sin cambios |

`npm ls` devolvió código 1 por conflictos históricos ajenos al conjunto objetivo;
los peers FontAwesome estaban satisfechos. No se clasifica como fallo de 8J3B.
Las versiones físicas coincidieron con la tabla; el wrapper antiguo 0.6.0,
sus metadatos View Engine y sus backups ngcc estaban ausentes del paquete activo.

## Compatibilidad de API y sorting

Se preservaron `FontAwesomeModule`, `FaIconLibrary`, `addIcons`,
`FaIconComponent`, `icon`, `fixedWidth` y su integración mediante `ContentChild`.
No fue necesaria adaptación de APIs. Permanecieron intactos
`sort-by.directive.ts`, `sort.directive.ts`, `visual-defaults.ts`, `CoreModule`,
`SharedLibsModule`, `jhipster-compat.module.ts` y los templates.

Se conservó el comportamiento histórico: asignación dinámica de `iconProp`
y llamada `ngOnChanges({})`. Sorting, predicate/callback y asignación dinámica
pasaron las comprobaciones originales; el icono público continúa siendo
`faSort` y el SVG renderizado conserva `data-icon="sort"`.
La aceptación manual F3 confirmó el comportamiento previo; no se corrigió
silenciosamente la flecha histórica.

## Validación automatizada aceptada

| Gate | Resultado |
|---|---|
| ngc | 0 diagnósticos |
| Jest focal | 2 suites, 5 tests, 0 fallos |
| Jest completo | 78 suites, 278 tests, 0 fallos |
| Webpack production | Correcto; 73 artefactos |
| Linker | Objetivo enlazado; 0 declaraciones objetivo sin enlazar |
| Validación estática | Correcta |
| Webpack development | Correcto con aislamiento temporal F-B autorizado |

Suites focales: `sort.directive.spec.ts` y `jhipster-compat.module.spec.ts`.
Validación estática: index con 8 referencias y 0 ausentes; Workbox con 53
referencias y 0 ausentes; i18n JSON válido; assets presentes;
`[object Module]`: 0.

El warning `DefinePlugin — Conflicting values for 'process.env.NODE_ENV'`
es preexistente, no bloqueante y ajeno al alcance. F-B permanece diferido.

## Preparación runtime

Java 21 y PostgreSQL 17.11 efímero, con almacenamiento tmpfs y sin volumen
persistente. Backend UP; frontend e i18n 200, JSON válido; login, `/api/account`
y User Management 200. Tipo sintético presente y reutilizado.

El verificador temporal usó inicialmente `/management/metrics` por error.
La aplicación utiliza `/management/jhimetrics`; se corrigió exclusivamente
el auxiliar temporal y se obtuvo 200 con JSON válido. El 404 inicial no fue
una regresión FontAwesome ni requirió cambios de aplicación.

Se reutilizó la cuenta sintética existente, sin crear otra. Se restableció
su contraseña temporal con BCrypt, preservando activación, authorities y
demás propiedades. Se confirmó acceso administrador y se reutilizó el Tipo.
No se incorporaron valores de acceso, hashes, tokens ni claves a este documento.

## Aceptación visual manual

Aceptación explícita del usuario, distinta de los gates automatizados:

| Prueba | Resultado | Alcance |
|---|---|---|
| F1 — Navbar | Aprobada | Iconos visibles, sin huecos/cuadrados nuevos; fixedWidth y navegación correctos |
| F2 — CRUD | Aprobada | Acciones representativas; sin SVG vacíos o rotos |
| F3 — User Management | Aprobada | Headers y sorting funcionales; comportamiento visual histórico preservado |
| F4 — Administración | Aprobada | Superficie rica en iconos; sin regresiones visuales ni unknown inputs observados |
| F5 — Console/Network | Aprobada | Sin nuevas regresiones FaIcon, DI, templates, partial-Ivy/linker, chunks, assets, i18n o Network |

## Tooling y limpieza de cierre

El aislamiento temporal de `eslint-loader` se retiró y el original se restauró
desde su backup exacto, verificando igualdad SHA-256. F-B continúa diferido.
Se detuvieron únicamente procesos 8J3B y se retiró su contenedor PostgreSQL
tmpfs, descartando los datos sintéticos sin volumen persistente.
Se eliminaron acceso sintético, backups anteriores, instalación limpia y caché
exclusivas, tarballs, metadatos, scripts, verificadores, logs y Node portable
de la etapa. Se conservaron los paquetes objetivo instalados, `node_modules`
general, Java, cachés globales y recursos ajenos.

## Blockers ngcc y camino a Angular 16

Blockers: 4 → 3. FontAwesome deja de ser un blocker ngcc.

| Blocker restante | Versión |
|---|---|
| `@ngx-translate/core` | 11.0.1 |
| `@ngx-translate/http-loader` | 4.0.0 |
| `ngx-webstorage` | 5.0.0 |

ngcc sigue siendo necesario. Angular 16 todavía no está preparado.
FontAwesome 0.12.1 es el puente Angular 15; un futuro salto a la línea 0.13.x
para Angular 16 requerirá investigación y validación separadas.

## Roadmap y conclusión

8J0: inventario completado. 8J1A: readiness infinite-scroll completada.
8J1B: infinite-scroll retirado e integrado. 8J2A: readiness ngx-cookie
completada. 8J2B: ngx-cookie retirado e integrado. 8J3A: selección FontAwesome
completada. 8J3B: puente FontAwesome técnicamente validado y aceptado manualmente.
Evolución de blockers ngcc: 6 → 5 → 4 → 3.

Puente FontAwesome Angular 15 completo; blocker ngcc FontAwesome eliminado;
ngcc todavía necesario; Angular 16 no preparado.

Siguiente unidad prevista, no iniciada: readiness e investigación de objetivo
o reemplazo de `ngx-webstorage`, con uso activo para token de autenticación,
remember-me, locale y previousUrl. No se presupone actualización, reemplazo,
API nativa de almacenamiento ni versión objetivo.
