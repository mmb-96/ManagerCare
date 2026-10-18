# Etapa 8J7D — Puente TypeScript 4.9.5 sobre Angular 15

## Objetivo, base y readiness

Actualización controlada de TypeScript 4.8.4 a **4.9.5 exacto**, conservando
Angular 15.2.10 y las demás dependencias. Validación y aceptación de cierre:
18 de octubre de 2026.

Base: `b736552e9e2faa711d2e1893036a5e88014f131f`,
`document Node 18 npm 6 bridge validation`.
Rama: `modernization/08j7d-typescript49-angular15-bridge`.
8J7C completó la investigación previa: seleccionó TypeScript 4.9.5 y un
delta esperado de un único nodo, sin altas ni bajas. Su rama readiness local
se conserva; no se integra ni se publica como parte de 8J7D.

## Herramientas, compatibilidad e integridad

Se utilizaron Node 18.20.8 oficial y npm 6.14.18 oficial portables, verificados
mediante sus integridades oficiales y limitados al proceso/TEMP. No se utilizó
el npm distribuido con Node 18 ni se alteraron las instalaciones globales.
Las llamadas npm anidadas de producción y desarrollo también usaron npm 6.14.18
y Node 18.20.8, con trazas de ejecución.

La metadata oficial de `typescript/4.9.5` confirmó ausencia de dependencias y
peerDependencies, `engines.node: >=4.2.0`, y el tarball:
`https://registry.npmjs.org/typescript/-/typescript-4.9.5.tgz`.
El SHA-512 descargado coincidió con la integridad oficial:

```text
sha512-1FXk9E2Hm+QzZQ7z+McJiHL4NW1F2EzMu9Nq9i3zAaGqibafqYwCVU6WyWAuyQRRzOlxou8xZSyXLEN8oKj24g==
```

Se confirmó compatibilidad con Angular/compiler-cli 15.2.10,
@ngtools/webpack 15.2.11, ts-jest 28.0.8 y jest-preset-angular 12.2.6.
No aparecieron conflictos de peers nuevos; el conflicto histórico de
eslint-config-jhipster con TypeScript `^3.4.5` continúa diferido.

## Delta de manifiesto, lockfile y grafo

El candidato se preparó y validó primero en TEMP. En package.json únicamente
cambió `devDependencies.typescript`, de `4.8.4` a `4.9.5`. En package-lock.json
solo cambiaron `version`, `resolved` e `integrity` de `dependencies.typescript`.
`dev: true` y lockfileVersion 1 se conservaron. Delta de paquetes en Git:
4 líneas añadidas y 4 eliminadas, sin ruido ajeno.

| Comprobación | Antes | Después |
| --- | --- | --- |
| Nodos recursivos | 3417 | 3417 |
| Nodos de primer nivel | 1505 | 1505 |
| TypeScript | 4.8.4 | 4.9.5 |
| Lockfile | v1 | v1 |

Único nodo actualizado: typescript. Añadidos: 0; eliminados: 0;
cambios ajenos: 0; conflictos de peers nuevos: 0; copias físicas TypeScript: 1.
Angular 15.2.10, CLI/ngtools 15.2.11, RxJS 6.5.5, tslib 2.3.1,
Jest 28.1.3 y Webpack 5.75.0 permanecen sin cambios.

## Instalaciones limpias y aplicación física

Se realizaron dos instalaciones aisladas desde el snapshot base, sin reutilizar
node_modules del workspace:

| Instalación | Comando npm 6 | Código | Paquetes | Duración |
| --- | --- | ---: | ---: | ---: |
| Online | `ci --ignore-scripts --no-audit --no-fund` | 0 | 3351 | 103,54 s |
| Offline | `ci --ignore-scripts --no-audit --no-fund --offline` | 0 | 3351 | 130,12 s |

La reproducción offline utilizó únicamente la caché TEMP poblada online:
0 peticiones HTTP. Scripts lifecycle y Protractor/WebDriver no se ejecutaron.
Los hashes SHA-256 del manifiesto y lockfile no cambiaron por npm en ninguna
instalación. Los avisos legacy no provocaron actualizaciones adicionales.

Solo después de estas verificaciones se aplicaron los dos candidatos al
workspace. No se ejecutó npm install ni npm ci sobre el workspace.
El paquete físico original TypeScript 4.8.4 quedó respaldado y verificado;
solo node_modules/typescript se sustituyó por la copia 4.9.5 verificada.
Los seis launchers tsc/tsserver conservaron su integridad. La resolución desde
compiler-cli, ngtools, ts-jest y jest-preset-angular, así como la carga real
durante los gates, confirmó TypeScript 4.9.5.

## Gates técnicos aceptados

| Gate | Resultado | Duración de ejecución |
| --- | --- | ---: |
| ngc | Verde, 0 diagnósticos | 17,22 s |
| Jest focal de traducciones | 7 suites / 42 tests, 0 fallos, 0 omitidos | 50,78 s |
| Jest completo | 84 suites / 316 tests, 0 fallos, 0 omitidos | 159,85 s |
| Webpack production canónico | Código 0, 73 archivos | 178,94 s |
| Desarrollo canónico | Bloqueo F-B histórico, código 1 | 92,45 s |
| Desarrollo con F-B aislado | Código 0, 2 bundles y 19 chunks | 63,83 s |

Jest se ejecutó directamente con su configuración real, sin npm test ni lint.
No se cambiaron expectativas, mocks, specs ni tsconfig. Persistieron los avisos
conocidos testURL/ts-jest; no se corrigieron.

Producción ejecutó el flujo completo `webpack:prod`:
`cleanup → webpack:prod:main → clean-www`. No se aceptó un comando interno
sin cleanup. Resultado: 73 archivos, 0 residuos ngc, sin contaminación.

El Angular Babel linker funcionó con los includes existentes de Webpack:
0 declaraciones partial-Ivy sin enlazar. Validación estática productiva:

| Comprobación | Resultado |
| --- | --- |
| Referencias de index | 7/7 presentes |
| Referencias Workbox | 53/53 presentes |
| i18n/es.json | JSON válido |
| Assets excluyendo SCSS | 26, presentes |
| Apariciones de `[object Module]` | 0 |

## Desarrollo y deuda F-B

Se utilizó exclusivamente el gate finito `webpack:build:main`, no un dev-server.
La ejecución canónica reprodujo el error histórico de eslint-loader en
logs.component.ts: `Parsing error: Cannot read properties of undefined (reading 'map')`.
El resultado fue un error y 201 warnings, incluyendo la deuda ESM/tslint ya
documentada; no se atribuye a una regresión nueva de TypeScript.

El aislamiento autorizado afectó únicamente a
node_modules/eslint-loader/dist/cjs.js. Hubo un intento inconcluso de captura
porque Windows PowerShell trató un aviso stderr de Browserslist como error;
se conservó su diagnóstico y se repitió el mismo gate con el entorno correcto,
sin cambiar la aplicación. La ejecución aislada válida terminó con 0 errores
y 7 warnings. El original se restauró inmediatamente mediante finally.

Restauración final: 84 bytes y SHA-256 coincidente:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
Aislamiento retirado; F-B sigue diferido. Se mantienen los avisos conocidos
Browserslist, Babel, `[hash]`, DefinePlugin/NODE_ENV, tamaños de assets y
compilaciones secundarias; producción informó 9 warnings.

## Contratos congelados

Identidad canónica Git frente a la base: **7/7 coincidentes**, diff vacío,
expectativas intactas. Se admite normalización LF/CRLF de Windows, no se usa
solo SHA-256 físico. Specs bajo src/test/javascript/spec/app/:

- shared/jhipster-compat/translate-runtime-contract.spec.ts
- shared/jhipster-compat/translate-loader.spec.ts
- shared/jhipster-compat/missing-translation-handler.spec.ts
- shared/jhipster-compat/language.service.spec.ts
- shared/jhipster-compat/template/translate.directive.spec.ts
- shared/jhipster-compat/alert.service.spec.ts
- layouts/main/main.component.spec.ts

## Runtime y recuperación del frontend

El primer intento quedó bloqueado porque Docker Desktop no ofrecía el motor
Linux. Tras recuperarlo, se utilizó desktop-linux y el contenedor exclusivo
managercare-8j7d-v1-postgres, PostgreSQL 17.11, loopback 15437, almacenamiento
tmpfs y ningún volumen persistente. Solo se usaron datos sintéticos mínimos.
Se reutilizó el administrador sintético existente, sin duplicarlo.

Backend: Temurin Java 21.0.12.1, Spring Boot 3.5.9 y perfiles dev,runtime-local,
con variables temporales y el perfil Maven webpack desactivado. Health:
200 / UP; login: 200; account: 200. No se activaron SMTP externo ni servicios Cloud.

Servir directamente la entrada del frontend desde el backend 8080 devolvió
401 para /, /index.html y /favicon.ico. No se modificó Spring Security ni se
atribuyó el bloqueo a TypeScript. La recuperación utilizó un servidor TEMP
separado, Node 18.20.8 y los serve-static/http-proxy ya instalados, en
127.0.0.1:9060. No se recompiló ni se alteró el output productivo validado.

El proxy tuvo destino fijo 127.0.0.1:8080 y solo las rutas históricas:
/api, /services, /management, /swagger-resources, /v2/api-docs, /h2-console y /auth.
Se conservaron método, body, autenticación, query y respuestas; no se inyectó JWT.
Raíz estática cerrada, sin directory listing ni lectura de temporales privados.

Index, favicon, i18n, bundles/CSS reales del índice y chunk comprobado:
HTTP 200 e integridad coincidente. Fallback SPA correcto; archivos inexistentes:
404; traversal: rechazado. Health por proxy: 200 / UP; API protegida anónima:
401; login/account autenticados: 200/200. Las credenciales solo existieron
en TEMP con permisos del usuario actual; no se incluyen aquí ni se versionaron.

## Aceptación manual

El usuario confirmó expresamente M1–M4 al autorizar este cierre:

| Prueba | Resultado |
| --- | --- |
| M1 — Interfaz y traducciones | Aprobada |
| M2 — Login sintético y navegación | Aprobada |
| M3 — Formulario de tipos e interacción sin guardar | Aprobada |
| M4 — F5, Console y Network | Sin errores nuevos relevantes |

Un intento inicial con credenciales por defecto no permitió acceso; el acceso
posterior con las credenciales sintéticas TEMP fue correcto. No es una regresión.
Las comprobaciones HTTP automatizadas no sustituyen esta aceptación manual.

## Limpieza final e integridad del alcance

Frontend y backend exclusivos se apagaron mediante señal normal a sus consolas,
con comprobación previa de pertenencia de los procesos. Se retiraron los
lanzadores residuales tras finalizar Java. Listener 9060 y listener 8080 libres.
Se detuvo y eliminó únicamente el contenedor 8J7D; puerto 15437 libre.
No se eliminó la imagen PostgreSQL ni el contenedor PostgreSQL 12.1 ajeno.

Antes de retirar TEMP se extrajeron únicamente resultados técnicos no sensibles.
Tras la aceptación manual el acceso privado dejó de ser necesario. Se eliminó
el directorio exclusivo 8J7D, incluyendo credenciales, logs, helper, output,
instalaciones aisladas, caché exclusiva, tooling portable y respaldos verificados.
Procesos y listeners exclusivos restantes: 0. No hubo volúmenes persistentes.

TypeScript físico 4.9.5 permanece en el workspace; no se restauró 4.8.4 ni se
eliminó node_modules del proyecto. eslint-loader original conservado con tamaño
y SHA coincidentes. Node/npm globales y PATH persistente permanecen intactos.
No se borraron ramas readiness ni otras ramas históricas.

El cierre añade únicamente este documento a los dos archivos de paquetes.
Código, tests, tsconfig, Webpack, Maven y CI permanecen intactos.
No se repitieron instalaciones, compilaciones, tests ni smoke durante el cierre.

## Límites, deuda y conclusión

TypeScript 4.9.5 queda técnicamente validado y aceptado manualmente sobre
Angular 15.2.10, sin declarar completada toda la modernización.

- Node 18 está EOL: uso temporal como puente histórico, no adopción permanente.
- npm 6 solo se valida como puente temporal; lockfile v1 preservado.
- Integración Maven frontend histórica: **no validada**; conserva sus pins antiguos.
- Frontend CI: **no disponible**. Backend CI no valida Angular ni sustituye estos gates.
- Jest fue desacoplado de su inicialización ngcc en 8J6B; no se reintrodujo.
- AngularWebpackPlugin15 mantiene ngcc interno. Retirada global: **no completa**.
- Angular 16: **no preparado todavía**.
- Se mantienen F-B ESLint, Protractor/ChromeDriver, Health SSL y demás deuda ajena.

Próxima investigación recomendada, **no iniciada**:
8J7E — Angular 16 dependency compatibility readiness, en modo lectura.
Debe separar peers pendientes (ng-bootstrap, angular-fontawesome, ngx-webstorage,
jest-preset-angular, zone.js), migración Angular, Node/npm permanente e
integración Maven frontend. 8J7D no implementa ninguna de esas actuaciones.
