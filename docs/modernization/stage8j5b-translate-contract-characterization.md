# Etapa 8J5B — caracterización de contratos de traducción

## Alcance, base y readiness

Base: `b77a0768d383f3f6ad62f7bbfe58478ddb889fdb`.
Rama: `modernization/08j5b-translate-contract-characterization`.

La etapa congela contratos observables sobre @ngx-translate/core 11.0.1 y
@ngx-translate/http-loader 4.0.0, sin actualizar paquetes ni producción.
8J5A completó la investigación y seleccionó como objetivo conjunto futuro
core 14.0.0 / http-loader 7.0.0. Ese objetivo no está implementado aquí.
La rama readiness 8J5A se conserva local, sin integrarla ni publicarla.

## Caracterización añadida y cobertura reutilizada

Único spec nuevo:
`src/test/javascript/spec/app/shared/jhipster-compat/translate-runtime-contract.spec.ts`.
Contiene 11 tests integrados con un host pequeño; no importa CoreModule completo.

Se reutilizan sin modificar seis specs existentes: translate-loader,
missing-translation-handler, language.service, template/translate.directive,
alert.service y MainComponent. Sus paths completos figuran en el manifest.
No se duplicó innecesariamente la cobertura directa del loader, handler,
servicio de idioma, alertas, títulos, cleanup de directiva o error histórico.

## Contrato del loader y propagación HTTP

Petición exacta comprobada:

```text
GET i18n/es.json?buildTimestamp=1234567890
```

Se preservan método GET, prefijo `i18n/`, idioma `es`, sufijo
`.json?buildTimestamp=...` y valor sintético estable. La respuesta HTTP con
`contract.hello = Hola` llega a TranslateService real y se recupera como `Hola`.
No se prueba únicamente la construcción de una URL.

## Inyección de dependencias real

TestBed resuelve TranslateService, TranslateLoader, MissingTranslationHandler
y JhiLanguageService mediante TranslateModule.forRoot y las factories locales
translatePartialLoader y missingTranslationHandler. Utiliza JhiConfigService
y JHI_COMPAT_CONFIG reales. No sustituye estas piezas por doubles; solo HTTP
se controla mediante HttpClientTestingModule/HttpTestingController.
Resultado: grafo DI válido.

## Inicialización y cambio de idioma

Init carga español: config.defaultI18nLang, estado local de JhiLanguageService,
idioma predeterminado y actual de TranslateService quedan en `es`; resultado
traducido `Hola`.

El cambio al idioma sintético `zz` actualiza el servicio local y su configuración,
carga la respuesta correspondiente, activa `zz`, emite onLangChange y produce
`Synthetic hello`. `zz` existe exclusivamente en fixtures de test: no se añadió
a LANGUAGES, assets ni configuración productiva.

## Traducciones ausentes y fallback

Con servicio y handler reales, la clave inexistente produce exactamente:

```text
translation-not-found[missing.contract.key]
```

El formato queda congelado sin reinterpretar guiones, corchetes o espacios.
El fallback se ejecutó y observó antes de fijar la expectativa: con `es`
predeterminado y `zz` activo, una clave presente solo en español devuelve
`Solo en español`. Por tanto, se consulta el idioma predeterminado antes del
missing handler. Una clave ausente en ambos conserva el marcador exacto.

## JhiTranslateDirective, TranslatePipe y host combinado

JhiTranslateDirective real resuelve una clave conocida como `Hola` e interpola
`Hola {{name}}` con el nombre sintético del fixture como `Hola Manuel`.
Tras cambiar de idioma actualiza el DOM a `Synthetic hello`, sin recrear el host.

TranslatePipe real, exportado por TranslateModule, renderiza claves estáticas
y dinámicas. Al cambiar la propiedad de clave produce `Hola` → `Otro texto`.
También se actualiza con el idioma. No existe wrapper ni mock del pipe.

Un mismo host combina directiva y pipes reales: ambos renderizan `Hola` y
ambos pasan a `Synthetic hello` después del cambio, sin recrear el componente.

## instant y carga compartida

Después de cargar español, TranslateService.instant con clave `contract.alert`,
texto `Error {{field}}` y parámetros `{ field: 'name' }` devuelve `Error name`.

La carga compartida también se observó antes de congelarla: dos suscriptores
al mismo proceso público de carga generan una sola petición HTTP y ambos
reciben `Hola`. El contrato es ese efecto observable, no los operadores internos
share, shareReplay o take de una versión concreta.

## Contratos históricos e aislamiento

Se conserva la cobertura directa existente de cleanup/takeUntil y del callback
de error de la directiva. No se corrigió que ese callback genere un marcador
sin asignarlo al DOM. Esa conducta histórica permanece fuera de alcance.

No se corrigió health.indicators.ssl ni ninguna traducción histórica ausente.
No se modificaron assets ni los atributos data-translate de Metrics Cache.

El spec restaura BUILD_TIMESTAMP, verifica peticiones pendientes, destruye el
host y reinicia TestBed. La configuración se clona y JhiConfigService conserva
su instancia independiente; no persiste `zz` ni modifica MANAGERCARE_CONFIG.
El nuevo spec pasó aislado y después dentro del focal completo.

## Resultados aceptados y baseline

Resultados obtenidos durante la ejecución técnica; no repetidos en el cierre:

| Ejecución | Suites | Tests aprobados | Fallos | Omitidos | Exit | Tiempo Jest |
|---|---:|---:|---:|---:|---:|---:|
| Nuevo spec aislado | 1 | 11 | 0 | 0 | 0 | 11,337 s |
| Focal completo | 7 | 42 | 0 | 0 | 0 | 13,401 s |
| Jest completo | 84 | 316 | 0 | 0 | 0 | 61,764 s |

Baseline: 83 suites / 305 tests → 84 suites / 316 tests; incremento de una
suite y once tests, sin fallos ni omitidos.

Warnings no bloqueantes: testURL y recomendación esModuleInterop de ts-jest.
No se corrigieron. Jest utilizó su configuración e inicialización automática
existentes; no se ejecutó ngcc manualmente. No se ejecutaron ngc, Webpack,
runtime, Docker ni backend para esta caracterización.

Los informes target/test-results son artefactos locales ignorados, no incluidos
en staging. Los temporales exclusivos 8J5B se eliminaron; se conservó el
tooling Node 14.21.3/npm 6.14.18 preexistente, sin instalación global.

## Manifest inmutable

SHA-256 de los bytes de los archivos de trabajo, recalculados al cierre:

| Path | SHA-256 |
|---|---|
| src/test/javascript/spec/app/shared/jhipster-compat/translate-runtime-contract.spec.ts | 0DC7677B4DCD57148ACD23D05C9587CC819A469AFEE311F7DF0C98EB192EE6CA |
| src/test/javascript/spec/app/shared/jhipster-compat/translate-loader.spec.ts | 339D378A2B1132D2E7D1A73DDEAAF7FBD9642C3B96EF1012DC38B27263FC9B68 |
| src/test/javascript/spec/app/shared/jhipster-compat/missing-translation-handler.spec.ts | E42B2E64A801958EF2650BD7FE3F25FB5A224EFE256BEA80BB6F55D2DBAC6821 |
| src/test/javascript/spec/app/shared/jhipster-compat/language.service.spec.ts | A89B72673529B91457F8E0577259FB83E3EA35088276DE2E6043B1628C4A2742 |
| src/test/javascript/spec/app/shared/jhipster-compat/template/translate.directive.spec.ts | 153E4A92F168F4DED6C50D055FDE9753690531E9C3044100D091C9D2D5E53CF6 |
| src/test/javascript/spec/app/shared/jhipster-compat/alert.service.spec.ts | 26383373AFBF846ECB1A74E658F2530FDE3ECBC58738D1D5DC6260D3826835AB |
| src/test/javascript/spec/app/layouts/main/main.component.spec.ts | 3CB2069C55787E17835B8F2011CC7E465C1572A9DEABE99D51B9D4B7FF5F52A6 |

Resultado exigido: 7/7 coincidentes. Expectativas congeladas.
Estos siete archivos constituyen el contrato inmutable de 8J5C: no adaptar
expectativas, relajar assertions ni reescribir tests para aceptar core 14 /
http-loader 7 sin análisis explícito previo. Una discrepancia obliga a detenerse,
no a actualizar automáticamente el manifest.

## Integridad del alcance

Únicos archivos de esta etapa: un spec nuevo y este documento.
Tests existentes, src/main, package.json, package-lock.json, Webpack, backend,
pom.xml y CI no cambian. No se añadieron secretos ni credenciales.
Las versiones físicas siguen en core 11.0.1 / http-loader 4.0.0.

El grafo permanece conceptualmente en 3419 nodos recursivos, 1505 de primer
nivel y lockfileVersion 1: no hubo cambios de dependencias ni recálculo npm
durante el cierre.

## NGCC, Angular 16 y siguiente etapa

8J5A está completada como readiness. 8J5B completa la caracterización para
integración. Permanecen dos blockers ngcc: core 11.0.1 y http-loader 4.0.0.
La caracterización no elimina ninguno ni permite retirar ngcc.
Angular 16 todavía no está preparado.

Siguiente etapa: 8J5C, actualización conjunta de ngx-translate para Angular 15
a core 14.0.0 / http-loader 7.0.0. No iniciada. Deberá preservar el manifest y
los contratos de URL, DI, init, cambio de idioma, missing, fallback, directiva,
pipe, host combinado, instant y carga compartida.

Tras esa futura implementación se esperan cero blockers, pendiente de demostrar.
Después siguen readiness/retirada separada de ngcc, modernización Node/toolchain
y readiness Angular 16. No se salta directamente a Angular 16.

## Conclusión

Caracterización de contratos de traducción completada y preparada para la
migración controlada 14/7. Backend CI posterior a la integración es una
validación adicional: no ejecuta ni sustituye Jest frontend, ngc, Webpack o
los contratos runtime de traducción. La evidencia frontend es la ejecución
técnica aceptada antes del commit.
