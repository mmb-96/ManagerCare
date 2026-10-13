# Etapa 8I4D — compatibilidad local del bootstrap de traducciones

## Alcance y base

Base: `27c3bd723583554f750993223e9006fe42955f00`
(`decouple ng-jhipster language service`).
Rama: `modernization/08i4d-translation-bootstrap`.

Se sustituyen exclusivamente las factories `translatePartialLoader` y
`missingTranslationHandler` de `ng-jhipster 0.12.0`, y la dependencia directa
de `JhiConfigService` legacy del bootstrap, por compatibilidad local.
No cambian dependencias, templates, JSON i18n, servicios de idioma/alertas/eventos,
backend, Webpack versionado ni CI.

## Contrato original e implementación local del loader

La implementación real inspeccionada expone:

```ts
translatePartialLoader(http: HttpClient): TranslateHttpLoader
```

Construye exactamente:

```ts
new TranslateHttpLoader(http, 'i18n/', `.json?buildTimestamp=${process.env.BUILD_TIMESTAMP}`)
```

La factory local está en
`src/main/webapp/app/shared/jhipster-compat/translate-loader.ts`.
Mantiene `HttpClient`, `TranslateHttpLoader`, el prefijo relativo `i18n/`,
el sufijo `.json?buildTimestamp=...` y el comportamiento HTTP.
La URL sigue siendo `i18n/<lang>.json?buildTimestamp=<valor>`.

Webpack continúa generando `BUILD_TIMESTAMP` con `new Date().getTime()` e
inyectándolo como cadena mediante `DefinePlugin`. No cambia su generación.
El timestamp concreto varía por build y no forma parte de un contrato fijo.
Webpack sigue agrupando los JSON fuente en `i18n/es.json`.

El nombre histórico de la factory no implica carga parcial dinámica:
ManagerCare no utiliza `addPart`, un registro de partes, merges en runtime
ni `TranslateModule.forChild()` para fragmentos.

## Contrato original e implementación local del handler

La factory `missingTranslationHandler(configService)` devuelve un handler
con `handle(params: MissingTranslationHandlerParams): string`.
En cada llamada lee `configService.getConfig().noi18nMessage` y devuelve:

```ts
`${noi18nMessage}[${params.key}]`
```

No realiza logging ni comprueba `i18nEnabled`.
El handler y su factory locales están en
`src/main/webapp/app/shared/jhipster-compat/missing-translation-handler.ts`.
Usan exclusivamente `JhiConfigService` local de
`app/shared/jhipster-compat/config.service`.

Se mantiene `translation-not-found[foo.bar]`, incluida la lectura de cambios
posteriores de configuración. También se conserva la interpolación histórica
con mensaje vacío (`[foo.bar]`) o `null` recibido en runtime (`null[foo.bar]`),
sin ampliar el tipo público de la configuración.

## Migración de CoreModule

`TranslateModule.forRoot(...)` conserva su estructura, `useFactory` y
dependencias: `HttpClient` para el loader y `JhiConfigService` para el handler.
Solo cambia la procedencia de ambas factories y del token de configuración
del handler a la capa local.

`NgJhipsterModule.forRoot(MANAGERCARE_CONFIG)` permanece sin cambios funcionales.
Su configuración interna transitiva sigue siendo necesaria para los exports
legacy que aún utiliza la aplicación.

## Imports directos legacy retirados

Número de declaraciones de import desde `ng-jhipster` en producción y tests:

| Símbolo | Antes de 8I4D | Después de 8I4D |
|---|---:|---:|
| `translatePartialLoader` | 1 | 0 |
| `missingTranslationHandler` | 1 | 0 |
| `JhiConfigService` | 1 | 0 |
| `JhiLanguageService` | 0 | 0 |

## Imports restantes de ng-jhipster

| Símbolo | Archivo | Motivo |
|---|---|---|
| `NgJhipsterModule` | `src/main/webapp/app/core/core.module.ts` | Configuración interna transitiva y exports pendientes |
| `NgJhipsterModule` | `src/main/webapp/app/shared/shared-libs.module.ts` | Directivas y exports visuales legacy |
| `JhiDataUtils`, `JhiDateUtils`, `JhiParseLinks` | `src/test/javascript/spec/test.module.ts` | Utilidades de tests pendientes |
| `JhiDateUtils` | `src/test/javascript/spec/app/core/user/user.service.spec.ts` | Utilidad histórica de tests |
| `JhiDateUtils` | `src/test/javascript/spec/app/core/user/account.service.spec.ts` | Utilidad histórica de tests |

Son cinco declaraciones de import restantes. No se declara retirado el paquete.

## Pruebas automatizadas

| Ejecución | Suites | Pruebas | Fallos |
|---|---:|---:|---:|
| Baseline después de 8I4C | 68 | 209 | 0 |
| Cobertura focal existente de Health/configuración | 2 | 5 | 0 |
| Focal final | 4 | 11 | 0 |
| Jest completo final | 70 | 215 | 0 |

Delta: dos suites y seis pruebas. Las suites nuevas se encuentran en
`src/test/javascript/spec/app/shared/jhipster-compat/translate-loader.spec.ts`
y `src/test/javascript/spec/app/shared/jhipster-compat/missing-translation-handler.spec.ts`.

La prueba del loader usa `HttpClientTestingModule` y `HttpTestingController`:
establece un timestamp sintético, exige la URL completa
`i18n/es.json?buildTimestamp=1700000000123`, comprueba GET y la traducción
devuelta por la respuesta simulada. Restaura el entorno tras la prueba.

Las cinco pruebas del handler cubren clave simple, clave histórica SSL,
lectura de configuración local modificada después de crear el handler,
independencia de `i18nEnabled`, mensaje vacío y mensaje `null` en runtime.

## Gates técnicos

| Gate | Resultado |
|---|---|
| `ngc` | Correcto, 0 diagnósticos |
| Jest focal | 4 suites / 11 pruebas / 0 fallos |
| Jest completo | 70 suites / 215 pruebas / 0 fallos |
| Webpack production | Correcto |
| Artefactos productivos | 73, igual a la base |
| `i18n/es.json` | JSON válido y HTTP 200 con query `buildTimestamp` |
| Referencias de index | Correctas |
| Workbox | Presente, con precache |
| Assets | Correctos |
| `[object Module]` | 0 |
| Webpack development | Correcto |

No se repiten gates durante el cierre documental.

## Aceptación manual

Resultados confirmados por el usuario en la autorización de cierre:

| Comprobación | Resultado |
|---|---|
| T1 — Bootstrap i18n | Aprobado: SPA en español, sin claves crudas nuevas ni errores de DI de traducción |
| T2 — Loader | Aprobado: `i18n/es.json?buildTimestamp=<valor>`, HTTP 200 y JSON válido |
| T3 — Handler | Aprobado: marcador histórico SSL observado naturalmente |
| T4 — Alerta traducida | Aprobado: alerta funcional y traducida, compatible con `JhiAlertService` local |
| T5/N — Console y Network | Aprobado: sin nuevos errores de loader, handler, configuración, DI, i18n o assets |

No se observaron 404/500 inesperados de traducciones.

## Marcador SSL de Health

Se preserva exactamente `translation-not-found[health.indicators.ssl]`.
Su observación acredita compatibilidad del handler local, no una corrección
de la traducción. La deuda H2 SSL sigue siendo preexistente, no bloqueante
y fuera de alcance. No se modifica ningún JSON para ocultarla.

## Tooling, warnings y limpieza

Node 14.21.3 / npm 6.14.18 oficiales portables, temporales y aislados bajo TEMP,
con SHA-256 verificado y `node-gyp` presente. No cambian PATH persistente,
instalaciones globales ni el grafo de dependencias.

Se mantienen los warnings heredados no bloqueantes de `DefinePlugin` /
`process.env.NODE_ENV`, tamaños de assets, `[hash]`, `caniuse-lite`, Jest legacy
y convergencia Maven Commons IO/Apiguardian. No se corrigen en este cierre.

Tras la aceptación se detienen frontend y backend y se eliminan exclusivamente
el PostgreSQL 17.11 efímero de 8I4D, su volumen, datos sintéticos, logs y runtime
portable. Se restaura `eslint-loader`, verificando SHA-256 contra el original.
Se conservan Java persistente, `node_modules` y todos los recursos ajenos.
F-B ESLint sigue diferido e independiente.

## Trabajo pendiente y hoja de ruta

8I0 y 8I4A: investigación completada. 8I1 (paginación), 8I2 (eventos),
8I3 (alertas), 8I4B (configuración) y 8I4C (idioma): integradas.
8I4D: bootstrap local de traducciones validado y aprobado para integración.

Permanecen `NgJhipsterModule`, `JhiTranslateDirective` / `[jhiTranslate]`,
exports visuales, utilidades exclusivas de tests y retirada futura del paquete.
También se difieren F-B ESLint, corrección SSL de Health, fechas nativas de
Audits, Protractor/ChromeDriver, modernización de Node, bloqueos ngcc restantes
y Angular 16.

La siguiente decisión debe revisar el orden entre reemplazar exports visuales,
retirar `NgJhipsterModule`, incorporar una directiva local y sustituir utilidades
de tests. No es seguro introducir otra directiva con selector `[jhiTranslate]`
mientras el módulo legacy exporta la suya. Ningún trabajo posterior se inicia
durante este cierre.

**8I4D: bootstrap local de traducciones validado.**
