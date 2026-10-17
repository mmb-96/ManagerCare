# Etapa 8J7B — Validación del puente Node 18/npm 6

## Alcance y base canónica

Validación técnica aceptada el 18 de octubre de 2026. Base canónica:
`41ef5f41d095f4c92ebc58e57464eab649558a9f`,
`decouple Jest from ngcc initialization`. Rama de trabajo:
`modernization/08j7b-node18-npm6-bridge`.

8J7B valida herramientas portables en copias TEMP del snapshot Git. No adopta
permanentemente Node/npm, no cambia dependencias ni modifica código,
configuración, scripts, tests o el lockfile. El cierre añade únicamente este
documento. Los gates aceptados no se repiten durante el cierre documental.

## Readiness previa 8J7A

8J7A concluyó la investigación de compatibilidad y seleccionó Node 18.20.8,
npm 6.14.18 y conservación inicial de lockfile v1. La estrategia separa la
transición Node de futuras decisiones sobre npm, TypeScript y Angular.
La rama local `modernization/08j7a-node-toolchain-readiness` se conserva.

## Selección temporal Node/npm

Node 18.20.8 procede del ZIP oficial Windows x64; su SHA-256 coincidió con
los checksums oficiales. npm 6.14.18 procede del paquete oficial de npm;
su SHA-512 coincidió con `dist.integrity`.

Se invocaron explícitamente el Node y el CLI npm verificados. Un shim exclusivo
TEMP garantizó Node 18.20.8/npm 6.14.18 también en las llamadas `npm run`
anidadas de los scripts canónicos. El preflight y el registro de llamadas
confirmaron esas versiones. No se utilizó npm 10 incluido en la distribución
Node ni se realizaron instalaciones globales.

## Seguridad y lifecycle

Node 18 está EOL. Su único uso aprobado es un puente histórico temporal de
migración, aislado y limitado a las validaciones. No es un destino productivo,
una versión actualmente mantenida ni una adopción permanente del toolchain.

El PATH se limitó al proceso; no se modificaron variables persistentes,
Node/npm globales ni configuración Git. Los scripts de instalación estuvieron
deshabilitados; el postinstall Protractor/WebDriver no se ejecutó. No se
descargaron ChromeDriver/GeckoDriver ni se ejecutaron E2E.

## Compatibilidad del stack

Todas estas versiones permanecieron intactas:

| Componente | Versión |
| --- | --- |
| Angular / `@angular/compiler-cli` | 15.2.10 |
| Angular CLI / `@ngtools/webpack` | 15.2.11 |
| TypeScript | 4.8.4 |
| RxJS | 6.5.5 |
| tslib | 2.3.1 |
| zone.js | 0.11.4 |
| Webpack | 5.75.0 |
| Jest | 28.1.3 |
| jest-preset-angular | 12.2.6 |

## Reproducibilidad online/offline

Se crearon copias aisladas del commit canónico mediante `git archive`, sin
copiar node_modules del workspace ni reutilizar salidas de build anteriores.
Se usó una caché de instalación exclusiva TEMP.

Instalación online:
`npm ci --ignore-scripts --no-audit --no-fund`.
Reproducción limpia offline: el mismo comando con `--offline`, utilizando
únicamente la caché TEMP obtenida en la instalación online.

| Instalación | Código de salida | Paquetes instalados | Duración |
| --- | ---: | ---: | ---: |
| Online | 0 | 3351 | 55,46 s |
| Offline | 0 | 3351 | 49,17 s |

Peticiones HTTP registradas durante offline: 0. Lifecycle scripts deshabilitados
en ambas instalaciones. Los hashes SHA-256 de package.json y package-lock.json
coincidieron antes y después de las instalaciones y al finalizar la validación.

## Lockfile y grafo

| Comprobación | Resultado |
| --- | ---: |
| lockfileVersion | 1 |
| Entradas recursivas | 3417 |
| Entradas de primer nivel | 1505 |
| Versiones modificadas | 0 |
| Integridades modificadas | 0 |
| Entradas añadidas / eliminadas | 0 / 0 |
| Bloqueantes `engines.node` | 0 |
| Nuevos conflictos de peers | 0 |
| Desajustes históricos de peers | 25 |

Los 25 desajustes coinciden con el entorno anterior: no son regresiones nuevas
de Node 18 ni fueron corregidos. El número de paquetes físicamente instalados
no se confunde con las entradas del lock, que también contempla paquetes
opcionales y específicos de otras plataformas. No se migró el lock a v2/v3.

## ngc

Ejecutado con Node 18.20.8: código 0, cero diagnósticos y 8,50 s de duración.
Sin cambios en TypeScript, tsconfig ni fuentes.

## Jest focal y completo

| Gate | Suites aprobadas | Tests aprobados | Fallos | Omitidos | Duración total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Focal de traducción | 7 | 42 | 0 | 0 | 65,72 s |
| Jest completo | 84 | 316 | 0 | 0 | 184,18 s |

Ambos usaron Node 18.20.8 y el observador TEMP activo. Intentos de carga ngcc
detectados durante Jest: 0. El globalSetup ngcc ya fue eliminado en 8J6B;
8J7B no modifica la configuración Jest. No se ejecutó `npm test`, que incorpora
lint histórico. Permanecen avisos de testURL, ts-jest y Babel, sin corregirlos.

## Observador y error TEMP corregido

El primer intento no llegó a iniciar Jest: NODE_OPTIONS --require transmitió
una ruta Windows cuyos separadores se interpretaron incorrectamente.
El error `Cannot find module` apareció en `internal/preload`, con código 1,
0,11 s y cero suites/tests ejecutados.

La corrección autorizada afectó solo al lanzador TEMP: ruta absoluta
normalizada a `C:/...` y correctamente entrecomillada, sin cambiar la lógica
del observador. El preflight terminó con código 0 y confirmó su carga real
en Node 18.20.8; los focales y Jest completo posteriores pasaron.
Se clasifica como error del lanzador TEMP, no como fallo de tests ni regresión
demostrada de ManagerCare.

## Webpack production: incidente de salida

La primera compilación interna terminó con código 0 y generó 73 artefactos
Webpack, pero el directorio físico tenía 479 archivos: esos 73 más 406 archivos
JavaScript/mapas emitidos por ngc previamente. Se comprobó la correspondencia
de los 406 archivos con fuentes existentes.

La causa fue la omisión de cleanup canónico por el lanzador TEMP. No fue una
regresión del compilador bajo Node 18. No se aceptó esa salida contaminada ni
se eliminaron manualmente los 406 archivos: se autorizó corregir exclusivamente
la orquestación TEMP y ejecutar el flujo canónico completo.

## Webpack production canónico validado

Script real conservado sin cambios:

```text
webpack:prod
  → cleanup: rimraf target/classes/static/ target/classes/aot
  → webpack:prod:main: npm run webpack -- --config webpack/webpack.prod.js --profile
  → clean-www: rimraf target/classes/static/app/{src,target/}
```

Se ejecutó `npm run webpack:prod` con Node 18.20.8/npm 6.14.18 explícitos,
controlando también las invocaciones anidadas. Todos los destinos de limpieza
se verificaron dentro de la copia TEMP, sin archivos versionados ni enlaces
de redirección. No se limpió el workspace original.

Cleanup, compilación, clean-www y ejecución global terminaron con código 0.
Duración total: 94,29 s. Compilación: 0 errores y 9 warnings. Salida productiva
física final: 73 archivos, cero residuos ngc y ninguna contaminación.
Este resultado sustituye al diagnóstico inicial de salida contaminada.

Persisten avisos de Browserslist, Babel, `[hash]`, DefinePlugin/NODE_ENV,
tamaños de assets/entrypoints y compilaciones secundarias. No se corrigieron.
No se utilizó Maven ni se añadió `--openssl-legacy-provider`.

## Angular Babel linker

Operativo con los includes actuales, sin modificar Webpack ni AngularWebpackPlugin.
Declaraciones partial-Ivy sin enlazar detectadas en la salida productiva: 0.
El linker sigue siendo necesario y no se confunde con ngcc.

## Recursos estáticos e i18n

Comprobados sobre la salida productiva canónica, antes del gate de desarrollo:

| Comprobación | Resultado |
| --- | --- |
| Referencias de index | 7/7 presentes |
| Referencias Workbox | 53/53 presentes |
| i18n/es.json | JSON válido |
| Assets excluyendo SCSS | 26, presentes |
| Apariciones de `[object Module]` | 0 |

## Webpack development y F-B

Se usó el gate finito `webpack:build:main`, que llama a webpack.dev.js;
no un servidor permanente. La ejecución canónica terminó con código 1,
59,17 s, un error y 201 warnings. El bloqueo fue el F-B histórico de
eslint-loader en logs.component.ts. El mensaje histórico era:

```text
Parsing error: Cannot read property 'map' of undefined
```

Node 18 mostró la variante literal:

```text
Parsing error: Cannot read properties of undefined (reading 'map')
```

También se observaron avisos al cargar `@typescript-eslint/tslint/config`
por require de un ES Module; esta deuda de lint ya está documentada en 8H4.
No se atribuyó a una regresión funcional nueva.

Se aplicó el aislamiento histórico autorizado exclusivamente a
`node_modules/eslint-loader/dist/cjs.js` de la copia TEMP, con respaldo exacto,
SHA-256 y tamaño previos. Desarrollo aislado: código 0, 42,19 s, cero errores,
7 warnings, 2 bundles y 19 chunks.

El original se restauró inmediatamente después mediante finally. SHA-256
coincidente y tamaño idéntico de 83 bytes. Aislamiento retirado.
F-B permanece diferido; no se afirma que ESLint esté corregido. Protractor y
ChromeDriver permanecen fuera de alcance.

## Contratos congelados 8J5B

Identidad Git respecto al commit base: 7/7 coincidentes, diff vacío y
expectativas intactas. La comprobación admite normalización LF/CRLF, no usa
solo hashes físicos. Contratos bajo `src/test/javascript/spec/app/`:

- `shared/jhipster-compat/translate-runtime-contract.spec.ts`
- `shared/jhipster-compat/translate-loader.spec.ts`
- `shared/jhipster-compat/missing-translation-handler.spec.ts`
- `shared/jhipster-compat/language.service.spec.ts`
- `shared/jhipster-compat/template/translate.directive.spec.ts`
- `shared/jhipster-compat/alert.service.spec.ts`
- `layouts/main/main.component.spec.ts`

## Integridad de paquetes y repositorio

Los 730 archivos versionados del snapshot conservaron identidad de contenido
Git, admitiendo únicamente diferencias físicas LF/CRLF. package.json y
package-lock.json conservaron sus hashes. Sin cambios en pom.xml, Webpack,
src/main, src/test, CI, configuración Git ni dependencias.

node_modules original preservado. Node/npm globales y PATH persistente intactos.
No hubo instalaciones globales ni cambios permanentes de versiones. El único
archivo añadido por el cierre es este documento; no se incorporan herramientas,
logs, scripts ni contenidos TEMP al repositorio.

## Maven y CI frontend pendientes

pom.xml conserva Node 12.16.1, npm 6.14.2 y frontend-maven-plugin 1.9.1 en la
integración frontend histórica. 8J7B no ejecutó ni validó los perfiles Maven
webpack/prod. Cambiar el PATH no modifica esos pins. Su alineación requiere
una etapa independiente y autorización posterior.

No existe actualmente una CI frontend que sustituya estos gates locales.
Backend CI excluye el perfil webpack y no valida Node/npm/frontend. Su
validación posterior a la integración corresponde exclusivamente al backend;
no sustituye las pruebas frontend aceptadas. No se modifican workflows.

## Limpieza de temporales

TEMP exclusivo 8J7B eliminado: copias e instalaciones, Node/npm portables,
observador, lanzadores/shim, scripts auxiliares, caché exclusiva, snapshots,
salidas, logs y respaldo F-B, este último tras verificar la restauración.
No se recreó TEMP durante el cierre documental.

Estado final aceptado: cero procesos y listeners temporales. Se preservaron
node_modules del workspace, Java, Docker, cachés globales y ramas readiness.
Dos logs npm del fallo F-B permanecieron en la caché habitual: no se eliminaron
por estar fuera del TEMP autorizado. No se afirma limpieza de cachés globales.

## NGCC y Angular 16

- Bibliotecas de aplicación que requieren ngcc: 0.
- Inicialización ngcc de Jest: eliminada previamente en 8J6B.
- Intentos de carga ngcc detectados durante Jest: 0.
- ngcc interno de AngularWebpackPlugin 15: presente.
- Eliminación global ngcc: no completada.
- Angular Babel linker: requerido.
- Angular 16 preparado para migración: no.

Siguen pendientes TypeScript 4.9.5, resolución de peers Angular 16, zone.js y
jest-preset-angular compatibles, salto coordinado Angular/toolchain y sus
validaciones específicas. No se retiró ni parcheó ngcc de AngularWebpackPlugin.

## Conclusión y siguiente etapa

Node 18.20.8/npm 6.14.18 quedan técnicamente validados como puente histórico
temporal de migración, manteniendo Angular 15.2.10, TypeScript 4.8.4, lock v1
y el grafo intactos. No se realizó una migración permanente del toolchain.

Siguiente unidad recomendada, no iniciada: 8J7C — TypeScript 4.9.5 readiness,
exclusivamente de lectura. Deberá estudiar compatibilidad Angular 15/16,
Jest/ts-jest, posibles diagnósticos, lock v1, impacto en el grafo, gates y riesgos
legacy. No autoriza implementar TypeScript 4.9.5 ni iniciar Angular 16.
La alineación Maven Node/npm continúa como deuda independiente.
