# Etapa 8I5B — compatibilidad local de templates y swap atómico de SharedLibs

## Alcance y base

Rama: `modernization/08i5b-local-template-compat-swap`.
Base: `2eecf3b3c0b64b5f13f5ba147efdcdd9e7eb658c`.

Se sustituye exclusivamente la superficie template-facing reexportada por
`ManagerCareSharedLibsModule`: antes procedía de `NgJhipsterModule`; ahora
procede de `ManagerCareJhipsterCompatModule` local. No se modifican los
consumidores ManagerCare ni sus selectores.

Alcance final: 20 archivos productivos locales nuevos, 9 archivos de pruebas
nuevos, un cambio en `src/main/webapp/app/shared/shared-libs.module.ts` y este
documento: 31 rutas. No cambian dependencias, backend, CI ni configuración
versionada de Webpack/ESLint.

## Readiness y caracterización legacy

8I5A identificó la superficie necesaria y el grafo de módulos. Antes del wiring,
8I5B congeló siete suites con 62 contratos contra ng-jhipster 0.12.0.
La misma batería se ejecutó posteriormente contra las implementaciones locales,
sin modificar las expectativas.

| Área | Legacy | Local |
|---|---:|---:|
| Traducción | 9/9 | 9/9 |
| Sorting / FontAwesome | 4/4 | 4/4 |
| Item count | 6/6 | 6/6 |
| Boolean | 11/11 | 11/11 |
| Pipes | 17/17 | 17/17 |
| Metrics | 12/12 | 12/12 |
| Threads/modal | 3/3 | 3/3 |
| Total | 62/62 | 62/62 |

Conclusión acotada: LOCAL == LEGACY bajo los 62 contratos observados y
congelados; no se afirma equivalencia universal fuera de esa cobertura.

## Arquitectura local

Directorio: `src/main/webapp/app/shared/jhipster-compat/template/`.
Módulo: `jhipster-compat.module.ts`, clase
`ManagerCareJhipsterCompatModule`.

- Declarations: exactamente 17.
- Imports: `CommonModule`, `FormsModule`, `NgbModule`, `FontAwesomeModule`.
- Exports: las mismas 17 declaraciones necesarias.
- Providers: ninguno propio ni legacy.
- Configuración: `JhiConfigService` LOCAL ya existente.

No hay imports desde `ng-jhipster` ni referencias a `NgJhipsterModule` en el
source nuevo de este directorio.

## Superficie de compatibilidad

Todos los archivos de la tabla pertenecen al directorio productivo anterior.

| Símbolo | Archivo | Selector / Pipe |
|---|---|---|
| JhiTranslateDirective | translate.directive.ts | [jhiTranslate] |
| JhiSortDirective | sort.directive.ts | [jhiSort] |
| JhiSortByDirective | sort-by.directive.ts | [jhiSortBy] |
| JhiItemCountComponent | item-count.component.ts | jhi-item-count |
| JhiBooleanComponent | boolean.component.ts | jhi-boolean |
| JhiJvmMemoryComponent | jvm-memory.component.ts | jhi-jvm-memory |
| JhiJvmThreadsComponent | jvm-threads.component.ts | jhi-jvm-threads |
| JhiMetricsHttpRequestComponent | metrics-request.component.ts | jhi-metrics-request |
| JhiMetricsEndpointsRequestsComponent | metrics-endpoints-requests.component.ts | jhi-metrics-endpoints-requests |
| JhiMetricsCacheComponent | metrics-cache.component.ts | jhi-metrics-cache |
| JhiMetricsDatasourceComponent | metrics-datasource.component.ts | jhi-metrics-datasource |
| JhiMetricsSystemComponent | metrics-system.component.ts | jhi-metrics-system |
| JhiMetricsGarbageCollectorComponent | metrics-garbagecollector.component.ts | jhi-metrics-garbagecollector |
| JhiThreadModalComponent | thread-modal.component.ts | jhi-thread-modal |
| JhiKeysPipe | keys.pipe.ts | keys |
| JhiPureFilterPipe | pure-filter.pipe.ts | pureFilter |
| JhiOrderByPipe | order-by.pipe.ts | orderBy |

No se exponen validators ni pipes adicionales no requeridos. El algoritmo de
filtrado que sostiene `pureFilter` es interno, no otro pipe público.

## Directiva de traducción

Se preservan el selector `[jhiTranslate]`, los inputs `jhiTranslate` y
`translateValues`, `ngOnChanges`, `ngOnInit`,
`TranslateService.get(...)`, `onLangChange`, escritura directa de
`innerHTML`, `Subject/takeUntil` y cleanup mediante `next()/complete()`
en destroy. Se respeta `i18nEnabled` de la configuración local.

El callback de error conserva su peculiaridad legacy: retorna el marcador,
pero no lo asigna al DOM. No se ha corregido ese comportamiento.

Se protegen las claves dinámicas observadas de Health
(`health.status.<estado>`) y Ribbon (`global.ribbon.<entorno>`).
Los 468 usos consumidores de `jhiTranslate` siguen intactos.

## Sorting y compatibilidad FontAwesome

`JhiSortDirective` conserva predicate, ascending, callback y emisiones,
incluido su orden. `JhiSortByDirective` conserva Host, ContentChild, click y
el caso especial `_score`.

La caracterización congela el comportamiento real con FontAwesome 0.6.0:
`iconProp` cambia, `icon` permanece `faSort` y el SVG renderizado mantiene
`data-icon="sort"`. Es comportamiento visual preexistente preservado, no
una corrección de iconos. El cast de compatibilidad está estrictamente localizado.

## Item count y Boolean

`jhi-item-count` mantiene page, total, itemsPerPage,
`global.item-count`, first/second/total y la decisión i18n capturada al
construirse. Con total cero conserva el resultado histórico 1–0 de 0.

`jhi-boolean` mantiene value, textTrue/textFalse, classTrue/classFalse,
truthiness, defaults legacy, ngOnInit, NgClass e innerHTML. No se añade
traducción interna.

## Pipes

- `keys`: pure, usa Object.keys y produce {key,value}[] en el orden natural;
  conserva arrays y errores para null/undefined sin guardas adicionales.
- `pureFilter`: pure; conserva strings case-insensitive, field, funciones,
  números, booleanos y objetos. Se conservan el objeto vacío que no selecciona
  elementos y la sobrescritura de coincidencia al recorrer varias propiedades,
  en lugar de convertirla en un AND.
- `orderBy`: pure; conserva predicate, reverse e igualdad. Muta el mismo
  array mediante sort; no clona ni añade null guards.

## Metrics y modal de threads

Se reproducen los ocho componentes Metrics (Memory, Threads, HTTP requests,
Endpoints, Cache, Datasource, System y Garbage Collector) y el modal local.
Se preservan selectors, inputs, templates inline, markup Bootstrap legacy,
cálculos, unidades, guards y comportamiento Ngb.

Threads conserva conteos de estados, apertura dinámica mediante la clase local
del modal, el mismo array de datos, filtros, stack traces y cierre/dismiss.
Los templates locales resuelven directiva, pipes y modal locales. No hay rediseño.

`metrics.model.ts` es un contrato auxiliar de tipado local; no cambia los
contratos backend ni añade APIs.

## Defaults visuales

`visual-defaults.ts` conserva exactamente:

- `faSort`, `faSortUp`, `faSortDown`.
- `badge badge-success`, `badge badge-danger`.
- `fa fa-lg fa-check text-success`.
- `fa fa-lg fa-times text-danger`.

No se amplía `JhiCompatConfig` ni se mezclan estos defaults con configuración
general, idioma o alertas.

## Swap atómico de SharedLibs

En `src/main/webapp/app/shared/shared-libs.module.ts` se reemplazan únicamente
el import y el export de `NgJhipsterModule` por
`ManagerCareJhipsterCompatModule`.

Antes: SharedLibs → NgJhipsterModule.
Después: SharedLibs → ManagerCareJhipsterCompatModule.

Siguen intactos FormsModule, CommonModule, NgbModule, InfiniteScrollModule,
FontAwesomeModule, ReactiveFormsModule y TranslateModule. Se mantiene el patrón
Angular de reexportación mediante exports, validado por host, ngc y build.

## CoreModule conserva forRoot

`src/main/webapp/app/core/core.module.ts` no fue modificado.
Mantiene `NgJhipsterModule.forRoot(MANAGERCARE_CONFIG)` y no reexporta el módulo
legacy. Su retirada corresponde exclusivamente a 8I5C.

## Integridad de I1 y consumidores

Antes de I2 se guardó fuera del repositorio un manifiesto SHA-256 de los 29
archivos aprobados. Antes del cierre se verificaron 20/20 source locales
intactos, siete specs congelados intactos y helper intacto.

Solo el spec de módulo/host cambió legítimamente: pasó del módulo local aislado
a importar exclusivamente ManagerCareSharedLibsModule como superficie pública,
sin duplicar suite ni cambiar template/expectativas del host.

| Uso consumidor ManagerCare | Antes | Después |
|---|---:|---:|
| jhiTranslate | 468 | 468 |
| jhiSort | 3 | 3 |
| jhiSortBy | 11 | 11 |
| jhi-item-count | 2 | 2 |
| jhi-boolean | 1 | 1 |
| keys | 4 | 4 |
| pureFilter | 1 | 1 |
| orderBy | 1 | 1 |

Se cuentan apariciones, no solo líneas: dos líneas contienen dos usos de
jhiTranslate. Los recuentos excluyen templates internos de la compatibilidad
local. HTML consumidores modificados: 0. Consumidores inline existentes
modificados: 0. No hubo migración masiva de selectores.

## Imports residuales de ng-jhipster

| Ámbito | Archivo | Símbolos |
|---|---|---|
| Producción | src/main/webapp/app/core/core.module.ts | NgJhipsterModule |
| Tests | src/test/javascript/spec/test.module.ts | JhiDataUtils, JhiDateUtils, JhiParseLinks |
| Tests | src/test/javascript/spec/app/core/user/user.service.spec.ts | JhiDateUtils |
| Tests | src/test/javascript/spec/app/core/user/account.service.spec.ts | JhiDateUtils |

CoreModule es el único import productivo directo restante. Las utilidades de
tests no se retiran en esta etapa.

## Tests automatizados y gates técnicos

Baseline anterior: 70 suites / 215 tests / 0 fallos.
Resultado final: 78 suites / 278 tests / 0 fallos.
Delta: +8 suites / +63 tests.

| Gate | Resultado aceptado |
|---|---|
| Caracterización legacy | 7 suites / 62 tests / 62 passed |
| Contratos locales tras swap | 7 suites / 62 tests / 62 passed; 29,101 s |
| Host público SharedLibs | 1 suite / 1 test / 0 fallos; 15,8 s |
| ngc | 0 diagnósticos |
| Jest completo | 78 suites / 278 tests / 0 fallos; 119,165 s |
| Webpack production | Correcto; compilación 142,049 s |
| Artefactos productivos | 73, igual a baseline |
| Referencias index | 7 / 0 ausentes |
| Workbox | 53 recursos precache / 0 ausentes |
| i18n/es.json | JSON válido |
| [object Module] | 0 |
| Webpack development | Correcto con aislamiento temporal autorizado de eslint-loader |

El ngc de I1 también comprobó el módulo local aislado, antes de conectarlo.
Los gates ya aceptados no se repiten durante este cierre.

## Aceptación manual

Aceptación explícita del usuario en el prompt de cierre; no se presenta como
validación automatizada ni se añaden pantallas/códigos no registrados.

| Comprobación | Aceptación |
|---|---|
| M1 — Traducciones tras el swap | PASS |
| M2 — Audits: rendering, sorting, item count y comportamiento visual compatible | PASS |
| M3 — User Management: sorting, paginación, item count y boolean/detail | PASS |
| M4 — Configuration: rendering, keys y sorting local | PASS |
| M5 — Health | PASS |
| M6 — Logs: pureFilter y orderBy | PASS |
| M7 — Superficies Metrics preparadas | PASS |
| M8 — Threads/modal dinámico | PASS |
| N — Console/Network: sin nuevas regresiones observadas durante aceptación | PASS |

El marcador `translation-not-found[health.indicators.ssl]` sigue siendo deuda
preexistente, no bloqueante y fuera de alcance; no se afirma aquí una nueva
observación del marcador ni se añade traducción para ocultarlo.

## Tooling y runtime

Node 14.21.3 / npm 6.14.18 portables oficiales y aislados, con PATH solo
temporal. No se ejecutó npm install/ci/update/uninstall ni cambió el grafo.

Runtime exclusivo con Java 21, PostgreSQL 17.11 y almacenamiento tmpfs:
`managercare-8i5b-v1-postgres`. Credenciales, JWT y datos exclusivamente
sintéticos. Backend health 200/UP, frontend 200, i18n 200 y JSON válido.
Liquibase: 30 changesets, lock libre. Login del fixture administrador sintético
y account correctos, sin imprimir contraseñas ni tokens.

Se mantienen warnings no bloqueantes de DefinePlugin / process.env.NODE_ENV,
caniuse-lite, Babel para módulos grandes, [hash], tamaños, parser de Bundle
Analyzer, Jest legacy y Maven Commons IO/Apiguardian/parameters.
El overlay de warnings observado fue distinguido de errores de compilación;
no se cambió configuración versionada para ocultarlo.

## Limpieza

Tras la aceptación se detuvieron exclusivamente frontend/backend y sus procesos
auxiliares de 8I5B. Se eliminó el contenedor PostgreSQL exclusivo; sus datos y
almacenamiento tmpfs desaparecieron con él. No había volumen persistente que
eliminar. No se utilizó prune ni se tocaron recursos de otros proyectos.

Se retiraron 23 archivos temporales de la etapa (logs, informes, manifiesto y
respaldo ya verificado), el Node portable exclusivo y el argfile temporal del
backend. Las credenciales/JWT eran variables de los procesos detenidos.
Resultado: 0 procesos del proyecto y 0 listeners temporales.

eslint-loader original restaurado antes del commit; SHA-256 idéntico al respaldo:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
El aislamiento temporal queda retirado. F-B ESLint sigue diferido.
Se conservan node_modules, Java reutilizable/persistente e instalaciones globales.

## Trabajo restante y roadmap

| Etapa | Estado / ámbito |
|---|---|
| 8I0 | COMPLETE — investigación |
| 8I1 | INTEGRATED — pagination |
| 8I2 | INTEGRATED — events |
| 8I3 | INTEGRATED — alerts |
| 8I4A | COMPLETE — readiness de idioma/traducción |
| 8I4B | INTEGRATED — config |
| 8I4C | INTEGRATED — language service |
| 8I4D | INTEGRATED — translation bootstrap |
| 8I5A | COMPLETE — template swap readiness |
| 8I5B | Compatibilidad local y SharedLibs swap validados y aceptados para integración |

Siguientes etapas, no iniciadas por este cierre:

1. 8I5C — retirar NgJhipsterModule.forRoot de CoreModule, con validación propia.
2. 8I5D — retirar utilidades residuales test-only.
3. 8I6 — retirar el paquete ng-jhipster.

## Diferido

Corrección visual de sorting, traducción Health SSL, F-B ESLint, fechas nativas
de Audits, Protractor/ChromeDriver, modernización Node, FontAwesome y
ngx-translate, restantes blockers ngcc y Angular 16.

## Conclusión

8I5B: compatibilidad local de templates verde, swap atómico validado y aceptación
manual completada. La equivalencia queda acotada a los contratos y verificaciones
registrados. Core forRoot y utilidades test-only permanecen para etapas separadas.
