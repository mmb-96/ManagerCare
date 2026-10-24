# 8J7H — Jest29 / preset13 / Angular15 bridge

## Objetivo y base

Actualizar Jest 28 a Jest 29 con `jest-preset-angular` 13, conservando
Angular 15 y las integraciones existentes. Base:
`351d1b4ebda77ad13822813aaffaed777a8da5e7`, rama
`modernization/08j7h-jest29-preset13-angular15-bridge`.

## Alcance

- `package.json`: seis dependencias directas de pruebas alineadas.
- `package-lock.json`: candidato caracterizado y validado, manteniendo
  `lockfileVersion: 1`; sin regenerarlo durante el cierre.
- `src/test/javascript/jest.conf.js`: transformador explícito de preset13.

No se modifican scripts npm, código productivo, specs, traducciones,
tsconfig, Webpack, backend ni workflows.

## Versiones de dependencias

| Paquete | Antes | Después |
| --- | --- | --- |
| `jest` | 28.1.3 | 29.7.0 |
| `ts-jest` | 28.0.8 | 29.1.5 |
| `jest-jasmine2` | 28.1.3 | 29.7.0 |
| `jest-preset-angular` | 12.2.6 | 13.1.6 |
| `jest-environment-jsdom` | Transitivo 28.1.3 | Directo 29.7.0 |
| `@types/jest` | 27.5.2 | 29.5.14 |

El lock incluye las dependencias transitivas del candidato aprobado:
Jest, jsdom e instrumentación, además de normalizaciones de ubicación de
aliases CJS de npm6 y una anotación `dev` de `opencollective-postinstall`.
Estas diferencias se caracterizaron en G2; no se presenta el diff como seis
cambios aislados ni como una prueba universal de equivalencia del grafo.

## Configuración Jest

Se conserva `preset: 'jest-preset-angular'` y se sustituye la configuración
legacy de `globals['ts-jest']` por el transformador explícito de preset13
para `ts|js|mjs|html|svg`. Sus opciones fijan `target: 'ES2015'`,
`module: 'CommonJS'` y `stringifyContentPathRegex: '\\.html$'`.

Se mantienen Jasmine como runner, jsdom como entorno, la inicialización
Angular/Zone.js existente, `jest-date-mock`, el setup, los mocks, los aliases
TypeScript, `testMatch`, las extensiones y los patrones de transformación.
No se reintroduce `globalSetup` ngcc. Los reporters siguen siendo
`jest-junit` y `jest-sonar-reporter`.

La invocación del proyecto selecciona explícitamente
`--config src/test/javascript/jest.conf.js`. En G5 se comprobó el archivo
real cargado y la equivalencia funcional con G3, sin aceptar los defaults
`jest-circus`, `node` o `babel-jest` como sustitutos. La corrección de rutas
Windows del verificador y sus controles permanecen exclusivamente en TEMP.

## Validación aceptada

| Gate | Evidencia y resultado |
| --- | --- |
| G1 | Integridad del candidato: GREEN. |
| G2 | Grafo aceptado para pruebas técnicas con límites explícitos; auditor universal incompleto. |
| G3 | Jest29 en TEMP: 7 suites/42 pruebas focales y 84 suites/316 pruebas completas, sin fallos. |
| G4 ngc | PASS, 0 diagnósticos. |
| G4 producción | PASS, 73 artefactos; index 7/7, assets 26/26 y Workbox 53/53; linker e i18n correctos. |
| G4 desarrollo | PASS con aislamiento temporal del `eslint-loader` histórico; loader original restaurado íntegramente. |
| G5 focal | Workspace real: 7/7 suites y 42/42 pruebas; 0 fallos, 0 omitidas, exit 0. |
| G5 completo | Workspace real: 84/84 suites y 316/316 pruebas; 0 fallos, 0 omitidas, exit 0. |
| Reporters G5 | JUnit y Sonar: XML válido, 316 casos cada uno en la ejecución completa. |

G5 utilizó `--runInBand`, los siete specs congelados en la focal y el
`testMatch` existente en la completa. No se modificaron expectativas ni
snapshots. Los outputs se confinaron a TEMP sin sobrescribir informes previos.
La selección de configuración superó 14 controles positivos y 16 negativos.
Las transiciones y el rollback se probaron sobre material desechable, y un
intento previo de aplicación se restauró por contenido antes del intento
final satisfactorio. Se conservan backups originales y evidencia de G1–G5.

Durante el cierre no se repitieron pruebas, instalaciones o compilaciones:
se contrastaron los archivos actuales con los hashes aceptados de G5.

## Compatibilidad conservada

| Componente | Versión |
| --- | --- |
| Angular | 15.2.10 |
| TypeScript | 4.9.5 |
| Zone.js | 0.13.3 |
| Webpack | 5.75.0 |

## Limitaciones conocidas

1. El auditor universal G2 no se completó. La aceptación para pruebas
   técnicas no equivale a certificar todas las resoluciones del grafo.
2. G2 offline presentó 406 archivos ausentes en 93 ubicaciones físicas de
   paquetes, con causa desconocida. Permaneció en cuarentena, sin repararlo
   ni utilizarlo como fuente de la integración.
3. G2 online fue la fuente verificada. Se utilizó un staging independiente
   y se comprobó su integridad antes de activarlo.
4. El sentinel G3 observó cero cargas y cero ejecuciones de ngcc en ese
   pipeline Jest certificado. No demuestra ausencia universal de ngcc ni
   constituye una nueva certificación instrumental del workspace G5.
5. Webpack development sin aislamiento conserva el fallo histórico de
   `eslint-loader`. La ejecución aislada pasó y el loader original se
   restauró completamente; su corrección permanente y F-B siguen pendientes.
6. `@angular-devkit/build-angular` sigue ausente y su peer no está satisfecho.
   Las rutas observadas de G3/G4 funcionaron sin instalarlo.
7. Node 18.20.8/npm 6.14.18 se utilizaron en el entorno TEMP validado. No se
   realizó una actualización general del toolchain, Node/npm global o PATH
   persistente.

El warning legacy de `testURL` se conserva; no se corrigió en esta etapa.

## Resultado y siguiente paso

Jest29/preset13 están aplicados y validados localmente sobre Angular 15.
Backend CI es una validación separada: debe atribuirse al commit publicado
y al PR hacia `master`; no se deduce su resultado de Jest local. El resultado
real de esa CI se informa por separado tras consultarla.

La publicación de esta etapa es para revisión: no autoriza merge ni
auto-merge. La siguiente modernización se tratará por separado.
Angular 16 no se ha iniciado ni validado en 8J7H.
