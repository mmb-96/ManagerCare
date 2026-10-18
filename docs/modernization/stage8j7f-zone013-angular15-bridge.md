# 8J7F — actualización controlada de Zone.js sobre Angular 15

## Objetivo y base canónica

Actualizar exclusivamente `zone.js` de 0.11.4 a 0.13.3 sobre la base
`958815c2d072401a366df4031bd320411e306e90`
(`upgrade TypeScript to 4.9.5 on Angular 15`), en la rama
`modernization/08j7f-zone013-angular15-bridge`.

La caracterización 8J7E está completada. Los resultados técnicos y la
aceptación manual descritos aquí se obtuvieron antes del cierre; no se
repitieron instalaciones, compilaciones, pruebas ni comprobaciones manuales
durante su documentación e integración.

## Stack conservado

| Componente | Versión final | Cambio en 8J7F |
| --- | --- | --- |
| Angular / compiler-cli | 15.2.10 | Ninguno |
| Angular CLI / ngtools | 15.2.11 | Ninguno |
| TypeScript | 4.9.5 | Ninguno |
| Zone.js | 0.13.3 | Antes 0.11.4 |
| RxJS | 6.5.5 | Ninguno |
| tslib | 2.3.1 | Ninguno |
| Webpack | 5.75.0 | Ninguno |
| Jest / ts-jest | 28.1.3 / 28.0.8 | Ninguno |
| jest-preset-angular | 12.2.6 | Ninguno |

## Selección y compatibilidad de Zone.js

Angular 15.2.10 admite `~0.11.4 || ~0.12.0 || ~0.13.0`.
Angular 16.2.12 declara `~0.13.0`. Zone 0.13.3 satisface ambos rangos,
sin que esto constituya una validación ni autorización para Angular 16.

### Metadata e integridad

- Metadata oficial: `https://registry.npmjs.org/zone.js/0.13.3`.
- Tarball oficial: `https://registry.npmjs.org/zone.js/-/zone.js-0.13.3.tgz`.
- Tamaño descargado: 644438 bytes; contenido descomprimido: 3120277 bytes,
  143 archivos.
- Integridad SHA-512 verificada:
  `sha512-MKPbmZie6fASC/ps4dkmIhaT5eonHkEt6eAy80K42tAm0G2W+AahLJjbfi6X9NPdciOE9GRFTTM8u2IiF6O3ww==`.
- Dependencia propia: `tslib: ^2.3.0`; la versión existente 2.3.1 satisface
  el requisito. Sin nuevos conflictos de pares.

### Imports y exports

Se verificó la resolución real con Node, el resolver de Jest y el resolver
efectivamente utilizado por Webpack 5:

| Import | Node / Jest | Webpack |
| --- | --- | --- |
| `zone.js/dist/zone` | `bundles/zone.umd.js` | `bundles/zone.umd.js` |
| `zone.js/dist/zone-testing` | `bundles/zone-testing.umd.js` | `bundles/zone-testing.umd.js` |
| `zone.js` | `bundles/zone.umd.js` | `fesm2015/zone.js` |
| `zone.js/testing` | `bundles/zone-testing.umd.js` | `fesm2015/zone-testing.js` |
| `zone.js/bundles/zone-testing-bundle.umd` | `bundles/zone-testing-bundle.umd.js` | `bundles/zone-testing-bundle.umd.js` |

Una comprobación auxiliar inicial seleccionó el `enhanced-resolve` 4.1.1
raíz, en lugar del 5.26.0 utilizado por Webpack 5.75.0. Se corrigió únicamente
ese auxiliar TEMP y la comprobación resultó correcta; no fue necesario
modificar el proyecto ni aplicar un parche al paquete.

## Manifest, lockfile y grafo

`package.json` cambia únicamente `dependencies.zone.js`.
`package-lock.json` cambia únicamente la versión, URL, integridad y requisito
de `tslib` de la entrada Zone.js (`^2.0.0` a `^2.3.0`).

| Métrica | Antes | Después |
| --- | ---: | ---: |
| Nodos recursivos | 3417 | 3417 |
| Nodos de primer nivel | 1505 | 1505 |
| lockfileVersion | 1 | 1 |

Un nodo actualizado: Zone.js. Ningún nodo añadido, eliminado o ajeno
modificado. Los candidatos online y offline coinciden.

## Tooling y reproducibilidad online/offline

Se utilizaron Node 18.20.8 oficial y npm 6.14.18 exclusivamente en TEMP.
El ZIP de Node se verificó mediante SHA-256:
`1a1e40260a6facba83636e4cd0ba01eb5bd1386896824b36645afba44857384a`.
También se verificó la integridad del paquete npm.

| Instalación aislada | Salida | Paquetes | Duración |
| --- | ---: | ---: | ---: |
| Online | 0 | 3351 | 81,50 s |
| Offline | 0 | 3351 | 82,56 s |

Se utilizó `npm ci --ignore-scripts --no-audit --no-fund`, añadiendo
`--offline` en la segunda copia. Scripts de ciclo de vida desactivados;
WebDriver no ejecutado; cero solicitudes HTTP offline. Ninguna instalación
modificó manifest o lockfile. Se compararon 142 archivos de contenido de
Zone con la distribución verificada; las diferencias de `package.json`
eran exclusivamente metadata npm de procedencia/integridad.

La sustitución física del workspace se limitó a `node_modules/zone.js`.
Los otros 3416 manifiestos quedaron idénticos. Angular, Webpack y
jest-preset-angular resuelven efectivamente Zone 0.13.3.

## ngc y Jest

| Gate | Resultado | Duración |
| --- | --- | ---: |
| ngc | Salida 0; 0 diagnósticos | 12,71 s |
| Jest focal | 7 suites; 42 pruebas; 0 fallos; 0 omitidas | 31,32 s |
| Jest completo | 84 suites; 316 pruebas; 0 fallos; 0 omitidas | 97,68 s |

La resolución real de Zone 0.13.3 se trazó también en los procesos de Jest.
El sentinel TEMP superó su control positivo. Durante las pruebas focales y
completas hubo cero intentos de carga de ngcc. No se reintrodujo
`globalSetup` ni se modificó Jest.

Se conservaron los warnings legacy de testURL, ts-jest TS151001 y Babel;
no se limpiaron en esta etapa.

## Webpack production, linker, estáticos e i18n

El comando canónico ejecutó `cleanup` → `webpack:prod:main` → `clean-www`.
Salida global 0, duración 111,63 s y 73 artefactos. Se comprobó el uso de
Node 18/npm 6 también en los comandos anidados.

- Angular Babel linker correcto; declaraciones partial-Ivy sin enlazar: 0.
- Residuos de ngc: 0; contaminación del resultado: ninguna detectada.
- Referencias de index: 7/7; Workbox: 53/53.
- i18n válido; 26 assets excluyendo SCSS.
- Apariciones de `[object Module]`: 0.

Se conservaron los warnings conocidos de Browserslist, Babel, hash,
DefinePlugin/NODE_ENV y tamaños de assets/chunks; el build productivo
registró 9 warnings. No se modificó Webpack.

## Webpack development y F-B

La ejecución canónica quedó bloqueada por el F-B histórico de
`eslint-loader`: `Parsing error: Cannot read properties of undefined (reading 'map')`
en `admin/logs/logs.component.ts`. Salida 1, 58,63 s, 201 warnings.

La ejecución aislada exclusivamente en `node_modules` pasó con salida 0,
28,48 s y 7 warnings. El auxiliar original se restauró. En el cierre se
verificaron nuevamente sus 84 bytes y SHA-256:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
No queda aislamiento activo. F-B permanece diferido.

## Contratos congelados y almacenamiento

Identidad Git canónica confirmada en los siete specs congelados:
translate-runtime-contract, translate-loader, missing-translation-handler,
language.service, translate.directive, alert.service y main.component.
Resultado 7/7 idénticos, sin modificar expectativas.

`webstorage-contract.spec.ts` y `helpers/storage-contract.ts` permanecen
idénticos. Código de aplicación, tests, tsconfig, Webpack, Maven y CI
no tienen cambios en esta etapa.

## Runtime PostgreSQL, backend y frontend separado

Se utilizó exclusivamente `managercare-8j7f-v1-postgres`, PostgreSQL 17.11
con tmpfs y sin volúmenes persistentes, ligado a loopback en 15437.
Backend Java 21 / Spring Boot 3.5.9 en loopback 8080 con datos,
credenciales y JWT sintéticos. Health 200 / UP.

Un servidor estático TEMP separado en `127.0.0.1:9060` sirvió el resultado
productivo validado, no un build anterior. Se verificó su inventario de
73 archivos y la integridad de bundles/chunks. El proxy conservó las rutas
históricas restringidas hacia `127.0.0.1:8080`, sin modificar Spring Security.

Index, favicon e i18n: 200; bundles/chunks: 200 e integridad verificada;
health por proxy: 200 / UP; API protegida anónima: 401;
login y account autenticados: 200 / 200. El servidor no se incorporó al repo.

## Aceptación manual M1–M4

El usuario confirmó expresamente:

| Comprobación | Resultado aceptado |
| --- | --- |
| M1: carga, traducciones, navbar e iconos | Correcto |
| M2: login admin sintético, navegación, modales, tooltips y cambios visibles | Correcto |
| M3: formulario, campos, validaciones e interacción asíncrona no destructiva | Correcto |
| M4: F5, persistencia de sesión y Console/Network sin errores nuevos | Correcto |

No se repitió el smoke durante el cierre ni se atribuyeron comprobaciones
adicionales a esta aceptación.

## Seguridad y limpieza TEMP

Frontend y backend exclusivos se apagaron limpiamente. Después del cierre
de Java se retiraron únicamente sus lanzadores remanentes. Se detuvo y
eliminó el contenedor PostgreSQL exclusivo; su imagen y el contenedor
PostgreSQL 12.1 ajeno permanecieron intactos.

Tras recopilar evidencia no sensible se eliminó exclusivamente el TEMP
8J7F, incluidas instalaciones aisladas, herramientas portables, caché propia,
logs, auxiliares, resultados, respaldo Zone 0.11.4 y archivos privados de
acceso con secretos sintéticos. No se incorporaron secretos al repositorio.

Resultado de limpieza: cero procesos, listeners y contenedores exclusivos;
cero volúmenes persistentes creados. Puertos 8080/9060/15437 libres.
TEMP eliminado. `node_modules` del workspace conservado, con Zone 0.13.3
y TypeScript 4.9.5. Node/npm global y PATH persistente sin modificaciones.

## Límites y deuda pendiente

- Node 18 está EOL; Node 18/npm 6 son únicamente un puente temporal.
- Frontend mediante Maven: no validado. CI frontend: no disponible.
- Jest desacoplado de la inicialización ngcc; AngularWebpackPlugin 15
  conserva ngcc interno. La retirada global de ngcc NO está completada.
- Angular 16 NO está listo ni iniciado.
- F-B ESLint y F-F E2E permanecen diferidos.
- No se modificaron runtime versionado, backend, CI ni otras dependencias.
- Backend CI del nuevo SHA se comprueba después del push a master y se
  informa separadamente; no sustituye los gates frontend aceptados.

## Conclusión y siguiente etapa

Zone 0.13.3 validado sobre Angular 15, con grafo mínimo y aceptación manual
M1–M4. El cierre se limita a los dos archivos de paquetes y este documento.

Siguiente unidad recomendada: 8J7G — Jest 29 / preset 13 compatibility
characterization, exclusivamente investigación en lectura para Jest 29.7.0,
ts-jest 29.1.5, jest-jasmine2 29.7.0, jest-preset-angular 13.1.6 y posible
alineación de @types/jest. Deberá caracterizar Angular 15/16, tsconfig y
prioridad del transformador, ES2022/async-await, jsdom, pares de build-angular,
transformadores Angular, inicialización Zone y preservación de Jest sin ngcc.
8J7G NO iniciada; ninguna actualización Jest ni Angular 16 en 8J7F.
