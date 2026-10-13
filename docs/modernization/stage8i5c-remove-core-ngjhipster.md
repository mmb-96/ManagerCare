# Etapa 8I5C — retirada de NgJhipsterModule.forRoot de CoreModule

## Alcance y base

Rama: `modernization/08i5c-remove-core-ngjhipster`.
Base: `b242f778af1e0cb73a587c3cb4fde429773aa7b3`.

El cambio productivo se limita a dos líneas eliminadas de
`src/main/webapp/app/core/core.module.ts`: el import de
`NgJhipsterModule` y la entrada
`NgJhipsterModule.forRoot(MANAGERCARE_CONFIG)`.
No hay otros cambios funcionales ni cambios en tests.

## Estado anterior

Después de 8I5B, ManagerCareSharedLibsModule ya reexportaba la superficie local
de ManagerCareJhipsterCompatModule. Directivas, componentes, pipes y modal de
threads eran locales. CoreModule conservaba el único import productivo directo
de ng-jhipster y su llamada forRoot.

## Provider legacy reconfirmado

La implementación real instalada de ng-jhipster 0.12.0 devuelve desde
`NgJhipsterModule.forRoot(moduleConfig)`:

```ts
{
  ngModule: NgJhipsterModule,
  providers: [{ provide: JhiModuleConfig, useValue: moduleConfig }]
}
```

La aportación específica de forRoot era únicamente el provider legacy
JhiModuleConfig. Tras 8I5B no quedaba consumidor productivo demostrado de ese
provider ni import legacy de JhiConfigService.
Una referencia a JhiModuleConfig en un comentario histórico local no es un
consumidor ni una inyección y no se modificó.

No se afirma que ng-jhipster haya desaparecido globalmente: el paquete sigue
instalado y declarado por los imports test-only pendientes.

## Wiring retirado

Se elimina exclusivamente:

- `import { NgJhipsterModule } from 'ng-jhipster';`
- `NgJhipsterModule.forRoot(MANAGERCARE_CONFIG)` del array imports de CoreModule.

No se reordena ni reformatea CoreModule.

## Configuración local conservada

Se mantienen MANAGERCARE_CONFIG, JHI_COMPAT_CONFIG y JhiConfigService LOCAL.
En providers permanece exactamente:

```ts
{ provide: JHI_COMPAT_CONFIG, useValue: MANAGERCARE_CONFIG }
```

No cambian config.model.ts ni config.service.ts. Alertas, idioma, missing
translation handler y compatibilidad template siguen usando configuración local.

## Bootstrap de traducción e idioma conservado

TranslateModule.forRoot mantiene su loader translatePartialLoader LOCAL y su
missingTranslationHandler LOCAL, con dependencia del JhiConfigService LOCAL.
No cambia nada de la implementación integrada en 8I4D.

Se conserva `languageService.init()`, así como JhiLanguageService LOCAL.
También permanecen intactos HttpClientModule, CookieModule.forRoot(),
NgxWebstorageModule.forRoot(), interceptores, LOCALE_ID, NgbDateAdapter,
DatePipe e inicialización FontAwesome.

SharedLibs, ManagerCareJhipsterCompatModule y las directivas, componentes, pipes
y templates de 8I5B no se modifican.

## Imports productivos después de 8I5C

| Búsqueda productiva en src/main/webapp | Antes | Después |
|---|---:|---:|
| Imports directos desde ng-jhipster | 1 | 0 |
| Referencias a NgJhipsterModule | Import y forRoot en CoreModule | 0 |

## Imports residuales test-only

La búsqueda global en src devuelve únicamente:

| Archivo | Símbolos |
|---|---|
| src/test/javascript/spec/test.module.ts | JhiDataUtils, JhiDateUtils, JhiParseLinks |
| src/test/javascript/spec/app/core/user/user.service.spec.ts | JhiDateUtils |
| src/test/javascript/spec/app/core/user/account.service.spec.ts | JhiDateUtils |

No se retiran providers/imports ni se copian implementaciones de estas
utilidades. Corresponden exclusivamente a 8I5D. package.json y package-lock.json
permanecen intactos; la retirada física del paquete corresponde a 8I6.

## Validación automatizada

Baseline de entrada y resultado final: 78 suites / 278 tests / 0 fallos.
No se añadieron ni modificaron tests.

El focal incluyó config, language service, alert service, translation loader,
missing translation handler, host público SharedLibs y los siete grupos de
caracterización local.

| Gate | Resultado aprobado |
|---|---|
| ngc | 0 diagnósticos |
| Jest focal | 13 suites / 77 tests / 0 fallos; 29,5 s |
| Contratos locales incluidos | 62/62 verdes |
| Jest completo | 78 suites / 278 tests / 0 fallos; 73,815 s |
| Webpack production | Correcto; compilación 71,997 s |
| Artefactos productivos | 73, igual a baseline |
| Index | 7 referencias / 0 ausentes |
| Workbox | 53 recursos / 0 ausentes |
| i18n/es.json | JSON válido |
| [object Module] | 0 |
| Webpack development | Correcto con aislamiento temporal autorizado de eslint-loader |

Development reprodujo primero el bloqueo F-B conocido del parser legacy en
logs.component.ts y del bridge TSLint/Angular ESM. Se aisló únicamente
eslint-loader dentro de node_modules, con respaldo, sin modificar código ni
configuración versionada. El build aislado terminó sin errores bloqueantes.
Los gates aprobados no se repiten durante el cierre.

## Aceptación manual

El usuario aprobó explícitamente C1–C4 en el prompt de cierre.
Estos resultados se registran como aceptación manual, no automatizada.

| Comprobación | Resultado y alcance |
|---|---|
| C1 — Bootstrap/login | PASS: arranque, español, login sintético y ausencia de regresión visible de DI/configuración |
| C2 — Traducción/config | PASS: carga i18n, superficie traducida y configuración/traducción tras retirar forRoot |
| C3 — Admin/template | PASS: superficie administrativa/template representativa preparada |
| C4 — Console/Network | PASS: sin nuevas regresiones observadas de DI, configuración, traducción, templates o red |

No se afirma una comprobación específica adicional de alerta traducida, ni se
añaden pantallas o códigos manuales que no quedaron registrados.
No se repite la matriz M1–M8 de 8I5B.

El marcador `translation-not-found[health.indicators.ssl]` sigue siendo deuda
preexistente, no bloqueante y fuera de alcance. No se modifica ningún JSON.

## Tooling y runtime de validación

Node 14.21.3 / npm 6.14.18 portables, procedentes del ZIP oficial.
SHA-256 comprobado frente al SHASUMS256.txt oficial antes de extraer:
`47CFB919BB86AB681369636A9CB925E2BD61991AAD1638B2E38E61EC956796A6`.
node-gyp presente y PATH únicamente temporal.
No se ejecutó npm install/ci/update/uninstall ni se cambió el grafo de dependencias.

Runtime exclusivo con Java 21 y PostgreSQL 17.11, contenedor
`managercare-8i5c-v1-postgres`, loopback y almacenamiento tmpfs.
Datos, cuentas, credenciales y JWT exclusivamente sintéticos y temporales.
Las comprobaciones HTTP preparatorias registraron backend health 200/UP,
frontend e i18n 200, JSON válido y login/account correctos.
Liquibase: 30 changesets y lock libre. No se documentan valores sensibles.

Persisten los warnings conocidos de DefinePlugin/process.env.NODE_ENV,
tooling legacy y Maven. No se confundió el overlay de warnings con una
regresión de DI ni se cambió configuración versionada para ocultarlo.

## Limpieza

Tras la aceptación se detuvieron exclusivamente frontend/backend 8I5C y sus
procesos auxiliares. Se eliminó su contenedor PostgreSQL y, con él, los datos
tmpfs. No existía volumen persistente asociado que eliminar.

Se retiraron diez archivos temporales de validación (logs, informes y respaldo
ya verificado), el Node portable exclusivo y el argfile temporal del backend.
Las credenciales/JWT eran variables de los procesos detenidos.
Resultado comprobado: 0 procesos del proyecto y 0 listeners temporales.

eslint-loader original restaurado antes del commit, con SHA-256 idéntico al
respaldo:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
El aislamiento temporal queda retirado; F-B sigue diferido e independiente.

Se preservan node_modules, Java reutilizable/persistente, instalaciones globales
y recursos ajenos. No se utilizó prune ni limpieza global.

## Trabajo restante

8I0, 8I4A y 8I5A: investigaciones/readiness completadas.
8I1, 8I2, 8I3, 8I4B, 8I4C, 8I4D y 8I5B: integradas.
8I5C: retirada de Core forRoot validada y aceptada para integración.

Siguientes etapas, no iniciadas en este cierre:

1. 8I5D — investigar y retirar los imports/providers residuales test-only,
   demostrando primero si son providers muertos, sin copiar utilidades por defecto.
2. 8I6 — retirar el paquete ng-jhipster.

## Diferido

Corrección visual de sorting, traducción Health SSL, F-B ESLint, fechas nativas
de Audits, Protractor/ChromeDriver, modernización Node, FontAwesome y
ngx-translate, restantes blockers ngcc y Angular 16.

## Conclusión

8I5C deja los imports productivos directos de ng-jhipster en 0 y las referencias
productivas a NgJhipsterModule en 0, preservando la configuración y el bootstrap
locales. Validación técnica verde y aceptación manual completada. La deuda
test-only y la retirada del paquete quedan para etapas separadas.
