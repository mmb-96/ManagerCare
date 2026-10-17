# Etapa 8J5C — puente ngx-translate para Angular 15

## Alcance y base

Base: `8e604f2d647fc4b414f0afb2ac1b8aabb228f65b`.
Rama: `modernization/08j5c-translate-angular15-bridge`.
8J5A seleccionó el objetivo 14/7; 8J5B caracterizó y congeló los contratos.
Esta etapa cambia exclusivamente las dos dependencias, su subgrafo de lockfile,
dos inclusiones del linker y este documento. No requiere cambios en código
productivo, tests, backend ni CI.

## Versiones

| Componente | Antes | Después |
| --- | --- | --- |
| `@ngx-translate/core` | 11.0.1 | 14.0.0 |
| `@ngx-translate/http-loader` | 4.0.0 | 7.0.0 |
| Angular | 15.2.10 | Sin cambios |
| TypeScript | 4.8.4 | Sin cambios |
| RxJS | 6.5.5 | Sin cambios |
| tslib raíz | 2.3.1 | Sin cambios |

El objetivo validado es compatible con este stack; no se actualizan sus otros componentes.

## Grafo de paquetes

Reconfirmación estructural sin ejecutar npm:

| Métrica | Antes | Después |
| --- | ---: | ---: |
| Nodos recursivos | 3419 | 3417 |
| Dependencias de primer nivel | 1505 | 1505 |
| `lockfileVersion` | 1 | 1 |

Dos versiones cambiadas, cero nodos añadidos, dos eliminados y cero cambios
ajenos al objetivo. Los eliminados son las copias privadas legacy de tslib de
ambos paquetes; tslib raíz permanece en 2.3.1.

## Formatos de los paquetes y estado físico

`core` 14.0.0 sustituye View Engine por partial-Ivy, generado con Angular 13
y compatible con el linker de Angular 15. No contiene metadata View Engine,
`.metadata.json`, `.__ivy_ngcc_bak` ni `__processed_by_ivy_ngcc__`.

`http-loader` 7.0.0 utiliza APF moderno y no contiene declaraciones Angular
que requieran transformación por el linker. Tampoco contiene metadata View
Engine ni respaldos ngcc. Ninguno de los dos objetivos requiere ngcc.

El workspace conserva físicamente core 14.0.0, http-loader 7.0.0 y tslib raíz
2.3.1, sin versiones antiguas activas, metadata View Engine, respaldos ngcc
ni copias privadas legacy de tslib bajo los dos objetivos.

## Webpack linker

Se añaden únicamente `@ngx-translate/core` y `@ngx-translate/http-loader` al
include existente para `@angular`, `@ng-bootstrap`,
`@fortawesome/angular-fontawesome` y `ngx-webstorage`.
No cambian loader, plugin Babel linker, opciones, resolve, AngularWebpackPlugin,
otras reglas ni inclusiones anteriores.

Core partial-Ivy queda enlazado: cero declaraciones de ngx-translate core sin
enlazar. Http-loader está incluido y tiene cero declaraciones que transformar
y cero declaraciones sin enlazar.

## Reproducibilidad limpia

Resultados ya obtenidos y aceptados; no repetidos durante el cierre:

- Metadata de `registry.npmjs.org`; tarballs verificados mediante SHA-512.
- Node 14.21.3 portable, npm 6.14.18 y PATH limitado al proceso; scripts deshabilitados.
- Instalación limpia online: exit 0, 58,47 s y 3351 paquetes.
- Instalación limpia offline: exit 0, 49,72 s y 3351 paquetes; cero peticiones HTTP.
- npm no modificó package.json ni package-lock.json.
- `npm ls` mantuvo únicamente conflictos históricos de codelyzer/TSLint ajenos
  al objetivo. No se ocultaron ni corrigieron.

## Contratos inmutables de 8J5B

Los siete specs conservan identidad Git de contenido/blob respecto a la base,
con diff vacío y expectativas sin cambios:

- `shared/jhipster-compat/translate-runtime-contract.spec.ts`
- `shared/jhipster-compat/translate-loader.spec.ts`
- `shared/jhipster-compat/missing-translation-handler.spec.ts`
- `shared/jhipster-compat/language.service.spec.ts`
- `shared/jhipster-compat/template/translate.directive.spec.ts`
- `shared/jhipster-compat/alert.service.spec.ts`
- `layouts/main/main.component.spec.ts`

Todos están bajo `src/test/javascript/spec/app/`.
El nuevo contrato conserva el blob `a481fe89c95600115c45d7df94c4eb87fb1223da`
y SHA-256 canónico `0DC7677B4DCD57148ACD23D05C9587CC819A469AFEE311F7DF0C98EB192EE6CA`.
Con `core.autocrlf=true`, la autoridad es identidad Git más diff vacío;
una diferencia física CRLF/LF no implica cambio contractual.

## Contratos de traducción preservados

- URL exacta: `GET i18n/es.json?buildTimestamp=<value>`.
- Propagación HTTP hacia TranslateService, DI e inicialización de JhiLanguageService.
- `changeLanguage` y comportamiento observable de `onLangChange`.
- Marcador `translation-not-found[missing.contract.key]` y fallback al idioma predeterminado.
- JhiTranslateDirective: renderizado, interpolación y actualización de idioma.
- TranslatePipe: claves dinámicas y actualización de idioma.
- Host combinado e interpolación mediante `instant`.
- Carga compartida: dos suscriptores, una petición HTTP y traducción recibida por ambos.

No se corrigieron `health.indicators.ssl`, traducciones ausentes históricas,
selector de idioma, LANGUAGES, assets i18n, JhiLanguageService,
JhiTranslateDirective, TranslateLoader ni MissingTranslationHandler.

## Validación automatizada

Resultados aceptados antes del cierre; no se repitieron los gates:

| Gate | Resultado |
| --- | --- |
| ngc | Verde; 0 diagnósticos |
| Jest focal | 7 suites / 42 tests / 0 fallos / 0 omitidos |
| Jest completo | 84 suites / 316 tests / 0 fallos / 0 omitidos |
| Webpack production | Verde; 73 artefactos |
| Linker | Verde; 0 declaraciones objetivo sin enlazar |
| Validación estática | Verde |
| Webpack development con aislamiento temporal | Verde |

Nuevo baseline frontend: **84 suites / 316 tests / 0 fallos**.
Los siete recursos referenciados por index y los 53 referenciados por Workbox
están presentes. `i18n/es.json` existe y es JSON válido; assets presentes;
cero apariciones de `[object Module]`.
El output `i18n/es.json` sigue siendo compatible con el query de cache busting.

El desarrollo canónico sigue bloqueado únicamente por F-B histórico exacto
de eslint-loader (`Cannot read property 'map' of undefined`). El aislamiento
usado fue exclusivamente temporal en node_modules. F-B queda diferido;
no constituye una regresión de 8J5C.

## Incidente del helper de runtime

El primer helper TEMP recibió `.Content` como `System.Byte[]` e intentó
parsearlo directamente como JSON: falso negativo del helper, no regresión
de la aplicación. La conversión byte[] → texto UTF-8 → JSON, conservando
también soporte para string, confirmó health 200 / UP sin cambiar archivos
versionados ni relajar los criterios de salud.

## Runtime validado

Docker Linux disponible; PostgreSQL 17.11 en el contenedor exclusivo
`managercare-8j5c-v1-postgres`, con tmpfs y sin volumen persistente.
Liquibase con lock libre. Java 21; health 200 / UP; login 200;
`/api/account` 200, cuenta activada y ROLE_ADMIN confirmado.
Frontend 200; `GET /i18n/es.json?buildTimestamp=<value>` devuelve 200 y JSON válido.
Login y account también validados mediante el proxy frontend.
Datos mínimos: un administrador sintético, cero Tipo y ningún duplicado.

## Aceptación manual

Resultados confirmados por el usuario en la autorización de cierre:

| Prueba | Resultado |
| --- | --- |
| L1 — Pública/Login | Aprobada: textos correctos, sin nuevas claves crudas ni ausencias inesperadas |
| L2 — Navbar y pantalla representativa | Aprobada: navegación y jhiTranslate correctos; F5 autenticado conserva traducciones |
| L3 — Administration/User Management | Aprobada: títulos, botones, labels, tablas y mensajes sin nuevas claves crudas |
| L4 — Ausencia histórica | No ejercitada manualmente; contrato automatizado verde |
| L5 — Network | Aprobada: i18n con buildTimestamp y HTTP 200; sin nuevos 404/500 inesperados de i18n, chunks o assets |
| L6 — Console | Aprobada: sin errores nuevos de traducción, DI, linker, JSON, chunks o templates |

No se afirma revisión de otras pantallas concretas. No se fabricó una traducción
ausente para L4. Cambio de idioma no exigido: `LANGUAGES = ['es']`, sin selector;
el contrato de changeLanguage está cubierto automáticamente con `zz`.
Los warnings históricos conocidos permanecen no bloqueantes, incluido
`Conflicting values for 'process.env.NODE_ENV'` de DefinePlugin.

## Seguridad

No se registraron valores de credenciales, hashes, claves de activación, JWT
ni Authorization. La evidencia Network se limita a método, path, query y status;
no se conserva el body completo. El acceso sintético solo existió en TEMP,
restringido al usuario actual, y se eliminó al cerrar el runtime.

## Limpieza del tooling y runtime

eslint-loader original restaurado desde el respaldo exacto de la etapa;
SHA-256 coincidente: `D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
El aislamiento temporal queda retirado. La copia del clean install tenía un
salto de línea final menos; se restauró el respaldo original, no esa variante.

Procesos exclusivos frontend/backend detenidos; contenedor tmpfs eliminado,
datos sintéticos descartados y ningún volumen persistente que eliminar.
Se eliminan exclusivamente el acceso manual, respaldos legacy, instalaciones
limpias, caché exclusiva, tarballs/metadata, snapshots, logs, scripts auxiliares
y Node portable propios de 8J5C. Se conservan node_modules general, los objetivos
14/7 activos, tslib raíz, Java, cachés globales, otros recursos Docker y ramas readiness.

## NGCC, roadmap y conclusión

8J5A: investigación completada. 8J5B: contratos integrados.
8J5C: puente validado y aprobado para integración.
Los bloqueantes ngcc conocidos pasan de **2 a 0**.
La retirada global de ngcc **todavía no está demostrada** y necesita una etapa separada.
Angular 16 **no está listo**: faltan prueba global sin ngcc, modernización
Node/toolchain y evaluación específica de Angular 16.

Conclusión: puente ngx-translate Angular 15 completado; contratos preservados;
bloqueantes ngcc conocidos eliminados, sin afirmar retirada global de ngcc.
Siguiente unidad recomendada: 8J6A — evaluación de retirada de ngcc, primero
en modo lectura. **No iniciada**. Después corresponderían retirada controlada,
modernización Node/toolchain y evaluación de Angular 16, sin saltar pasos.

Backend CI postintegración se verifica por separado; no sustituye ngc, Jest,
Webpack frontend, los contratos ni la aceptación manual ya obtenidos.
