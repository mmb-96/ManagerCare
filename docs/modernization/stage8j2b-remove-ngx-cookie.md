# Etapa 8J2B — retirada de ngx-cookie y del wrapper CSRF muerto

## Alcance y base

Rama: `modernization/08j2b-remove-ngx-cookie`.
Base: `7e842db77ab613d0fb1750d212639e1b8056dced`.

Retirada exclusiva de ngx-cookie 4.0.2 y CSRFService, sin reemplazo,
funcionalidades nuevas ni cambios de seguridad. No cambian tests, Webpack,
backend, CI, configuración ESLint versionada ni otros paquetes.

## Hallazgos de readiness

8J2A confirmó 0 consumidores reales de CSRFService, 0 barrels/reexports,
0 tests y 0 factories/providers consumidores. CookieService solo se inyectaba
en ese wrapper; providedIn root no demostraba su utilización.

La implementación instalada de Angular 15.2.10 extrae XSRF de DOCUMENT.cookie,
sin depender de ngx-cookie ni del wrapper. El backend conserva su configuración
preexistente. No se requiere biblioteca, servicio ni shim de reemplazo.

## Cambios de fuentes

En `src/main/webapp/app/core/core.module.ts` se eliminaron exclusivamente:

- `import { CookieModule } from 'ngx-cookie';`
- `CookieModule.forRoot(),` del array imports.

Se eliminó completamente `src/main/webapp/app/core/auth/csrf.service.ts`.
No se crea wrapper de document.cookie ni helper equivalente.
Todos los demás imports, módulos, providers y configuración permanecen intactos.

## Invariantes de seguridad

| Mecanismo | Estado preservado |
| --- | --- |
| HttpClientModule | Sin cambios |
| Extractor Angular XSRF | HttpXsrfCookieExtractor, fuente DOCUMENT.cookie |
| Cookie XSRF predeterminada | XSRF-TOKEN |
| Header XSRF predeterminado | X-XSRF-TOKEN |
| Configuración XSRF personalizada | No existe; no se añade |
| SecurityConfiguration y SecurityFilterChain | Sin cambios |
| Backend CSRF | Deshabilitado como estado preexistente: .csrf(AbstractHttpConfigurer::disable) |
| SessionCreationPolicy | STATELESS, sin cambios |
| JWTFilter y AuthInterceptor | Sin cambios |
| Almacenamiento JWT | ngx-webstorage, sin cambios |
| Authorization | Bearer obtenido de webstorage, sin cambios |
| CORS y headers de seguridad | Sin cambios |
| Swagger withCredentials | Sin cambios |
| Cookie de idioma del backend | Sin cambios |

También se preservan NgxWebstorageModule, TranslateModule, HTTP_INTERCEPTORS,
FontAwesome, JHI_COMPAT_CONFIG, language service y datepicker.

## Grafo de paquetes y preservación de tslib

Mutación mediante patch textual mínimo e invariantes estructurales, sin
npm uninstall ni regeneración amplia del lock.

package.json: retirada exclusiva de la dependencia ngx-cookie 4.0.2.
package-lock.json: retirada exclusiva de su subárbol, que contiene ngx-cookie
y una copia anidada de tslib 1.14.1. Esa copia solo era consumida por el paquete.

tslib raíz 2.3.1 y todas las demás copias se preservan. Ninguna otra dependencia
o devDependency cambia. Diff funcional: cuatro archivos y 29 eliminaciones.

| Invariante | Antes | Después |
| --- | ---: | ---: |
| Nodos recursivos | 3420 | 3418 |
| Entradas de primer nivel | 1506 | 1505 |
| lockfileVersion | 1 | 1 |
| Nodos retirados | — | 2: ngx-cookie y su tslib anidado |
| Transitivas exclusivas retiradas | — | 1 |
| Nodos añadidos | — | 0 |
| Nodos conservados modificados | — | 0 |

JSON válido. Igualdad profunda de package.json menos la dependencia y del lock
menos el subárbol: PASS. Comparación nodo por nodo, propiedades e invariantes
textuales/EOL: PASS. CoreModule coincide con su original menos las dos líneas
autorizadas. Diff de backend y de los servicios/interceptors de auth: vacío.

## Reproducción limpia

Node 14.21.3 / npm 6.14.18 oficiales portables, verificados mediante SHA-256
contra SHASUMS256 oficial; node-gyp presente. PATH exclusivamente temporal.
Entorno persistente intacto.

En un directorio temporal limpio con copias de ambos package files, sin copiar
la instalación del proyecto:

```text
npm ci --ignore-scripts --offline --no-audit --no-fund
```

Código 0. Duración total 72,582 s; npm informó 3352 paquetes en 70,918 s.
Red durante la instalación: no. Scripts/postinstall/WebDriver: desactivados.
Hashes de ambos package files intactos. Instalaciones ngx-cookie, incluidas
anidadas: 0. tslib raíz y demás copias compartidas presentes.

## Workspace funcional

Se respaldaron y verificaron los 73 archivos del paquete instalado antes de
retirar únicamente node_modules/ngx-cookie, incluido su tslib anidado.
El paquete estuvo físicamente ausente durante todos los gates y el runtime.
No se restauró para superar ngc, Jest ni Webpack. Referencias activas restantes
en fuentes y tests a ngx-cookie, CookieModule, CookieService y CSRFService: 0.

## Validación automatizada aceptada

| Gate | Resultado real |
| --- | --- |
| ngc | Código 0; 0 diagnósticos |
| Focal auth/HTTP | 5 suites / 35 tests / 0 fallos |
| Jest completo | 78 suites / 278 tests / 0 fallos; baseline conservada |
| Webpack productivo | Código 0; 9 warnings conocidos |
| Artefactos productivos | 73 |
| Contenido activo de paquete/módulo retirado | 0 |
| Index | 8 referencias, incluida base; 0 ausentes |
| Workbox | 53 referencias; 0 ausentes |
| i18n/es.json | JSON válido |
| Assets referenciados | Presentes |
| [object Module] | 0 |
| Webpack development aislado | Código 0; 7 warnings conocidos |

| Suite focal | Tests | Fallos |
| --- | ---: | ---: |
| account.service.spec.ts | 15 | 0 |
| login.component.spec.ts | 4 | 0 |
| tipo.service.spec.ts | 5 | 0 |
| notification.interceptor.spec.ts | 1 | 0 |
| main.component.spec.ts | 10 | 0 |

Son cobertura de regresión auth/HTTP cercana al bootstrap, no tests directos
de XSRF. No se repiten los gates durante el cierre.

## Brecha de cobertura y tooling

No existen tests específicos de CSRFService, CookieService, XSRF,
AuthInterceptor ni AuthServerProvider. No se añaden tests para código muerto.
La independencia XSRF se demostró mediante la implementación Angular instalada;
ngc, builds, runtime y aceptación C1–C4 cubren el riesgo residual.

Dev canónico reprodujo el F-B preexistente de eslint-loader en
logs.component.ts: `Cannot read property 'map' of undefined`.
Se utilizó únicamente el aislamiento temporal autorizado del loader, sin
modificar configuración versionada. F-B sigue diferido.

`DefinePlugin — Conflicting values for 'process.env.NODE_ENV'` permanece
preexistente, no bloqueante y fuera de alcance. Los warnings legacy de Jest,
Babel, Browserslist y Webpack tampoco se corrigen.

## Preparación runtime

Java 21.0.12.1 y PostgreSQL 17.11, contenedor exclusivo
`managercare-8j2b-v1-postgres`, almacenamiento tmpfs, sin volumen persistente.
Cuenta y datos exclusivamente sintéticos; no se documentan valores de acceso.

Backend 200/UP; frontend 200; i18n 200/JSON válido.
Liquibase: 23 changesets con contexto dev y lock libre.
Registro 201; activación 200; login 200; /api/account 200.
Tipo sintético: create 201, update 200 y delete 204.

El cliente HTTP preparatorio utilizó Authorization; no añadió X-XSRF-TOKEN
ni Cookie. Esto no es una observación del navegador. No hubo 401/403 inesperados.
Los valores sintéticos de password, activation key y JWT no aparecieron en
los logs del backend revisados. No se conservan en documentación.

## Aceptación manual

El usuario aprobó explícitamente los cuatro resultados; no son automatizados:

| Comprobación | Resultado y alcance |
| --- | --- |
| C1 — Bootstrap/login | PASS: SPA, login, español y ausencia de nuevos errores observados de módulos/providers |
| C2 — Lectura autenticada | PASS: navegación/account correctos, sin 401/403 inesperados |
| C3 — Mutación autenticada | PASS: create/update/delete de Tipo sintético, sin regresión XSRF/CSRF observada |
| C4 — Console/Network | PASS: sin nuevas regresiones observadas de DI, módulos, templates, cookies, XSRF, chunks, assets, i18n o red |

## Conclusión de seguridad

Se retira una dependencia frontend muerta y su wrapper sin consumidores.
La configuración de seguridad permanece intacta: Angular XSRF, backend CSRF,
JWT, Authorization, webstorage, CORS y SecurityConfiguration no cambian.
Esta conclusión se limita a la retirada; no evalúa la necesidad general de CSRF.

## Limpieza

Frontend/backend y auxiliares exclusivos detenidos. Contenedor PostgreSQL
eliminado y datos tmpfs descartados, sin volumen persistente. Puertos temporales
libres. Sin prune ni limpieza global.

eslint-loader original restaurado con SHA-256 idéntico al respaldo:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
Aislamiento temporal retirado; F-B diferido.

Eliminados exclusivamente respaldos, instalación limpia, runtime/acceso sintético,
logs, informes, scripts/verificadores y Node portable de esta etapa.
Se preservan la instalación general del proyecto, tslib raíz, Java, caches,
instalaciones globales y recursos Docker ajenos. No se restaura ngx-cookie.

## Bloqueantes ngcc y conclusión

El recuento pasa de cinco a cuatro:

| Paquete restante | Versión preservada |
| --- | --- |
| @fortawesome/angular-fontawesome | 0.6.0 |
| @ngx-translate/core | 11.0.1 |
| @ngx-translate/http-loader | 4.0.0 |
| ngx-webstorage | 5.0.0 |

8J0 y las investigaciones 8J1A/8J2A completadas; 8J1B integrada.
8J2B validada y aceptada para integración: ngx-cookie y el wrapper CSRF retirados,
sin reemplazo y con configuración de seguridad preservada.
Evolución de bloqueantes: 6 → 5 → 4. ngcc sigue requerido; Angular 16 no preparado.
Siguiente unidad prevista: readiness e investigación de versiones de FontAwesome
y sus paquetes relacionados. **No iniciada.**
