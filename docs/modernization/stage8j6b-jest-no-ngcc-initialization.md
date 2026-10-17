# Etapa 8J6B — inicialización de Jest sin ngcc

## Alcance y base

Base: `02721e525de62cb1bd6f127bfa94b7ec6b8bb6f1`
(`upgrade ngx-translate Angular 15 bridge`).
Rama: `modernization/08j6b-jest-no-ngcc-initialization`.

El único cambio técnico elimina de `src/test/javascript/jest.conf.js`:

```js
globalSetup: 'jest-preset-angular/global-setup',
```

Se conservan preset, transformador, setup-jest, entorno, mapeos, reporters,
resto de opciones y finales de línea. No se añade `skipNgcc` ni se actualizan herramientas.

## Investigación previa

8J6A completó la investigación en modo lectura: cero bibliotecas publicadas
View Engine que requieran ngcc, un gancho global explícito de Jest y una
integración interna independiente en AngularWebpackPlugin 15.
La rama readiness se conserva exclusivamente local; no se integra ni publica.

## Baseline y grafo

| Componente | Versión conservada |
| --- | --- |
| Angular / compiler-cli | 15.2.10 |
| Angular CLI / ngtools | 15.2.11 |
| TypeScript | 4.8.4 |
| RxJS | 6.5.5 |
| Webpack | 5.75.0 |
| Jest | 28.1.3 |
| jest-preset-angular | 12.2.6 |

Grafo comprobado estructuralmente: 3417 nodos recursivos, 1505 de primer nivel,
`lockfileVersion: 1` y cero cambios en dependencias. package.json y package-lock.json
permanecen intactos. Baseline frontend: 84 suites / 316 tests, sin fallos ni omitidos.

## Instalación raw limpia

Se creó una copia TEMP del commit base incorporando únicamente el cambio de
jest.conf.js. Se usaron Node 14.21.3 oficial portable, checksum verificado,
npm 6.14.18 y PATH limitado al proceso, con registry oficial.

```text
npm ci --ignore-scripts --no-audit --no-fund
```

Resultado medido: exit 0, 3351 paquetes y 59,78 s. Scripts lifecycle deshabilitados;
no se ejecutó el postinstall de WebDriver. Los hashes de package.json y
package-lock.json permanecieron iguales antes y después.
El snapshot anterior a Jest contenía cero bloqueantes View Engine y cero
residuos generados por ngcc.

## Evidencia de Jest sin ngcc

Un sentinel exclusivo de TEMP detectó intentos de cargar el módulo ngcc o
ejecutarlo mediante procesos. Superó controles positivos que bloquearon ambas
rutas antes de ejecutar ngcc. Estuvo activo en el proceso principal y auxiliares.
Durante las ejecuciones reales de Jest hubo **cero intentos de carga y cero
intentos de ejecución ngcc**.

La configuración efectiva confirmó ausencia de globalSetup y conservación
del preset, jsdom, transformador, setup-jest, mapeos y reporters.
La comparación de 112706 archivos de node_modules antes y después de Jest
registró cero modificaciones, añadidos o eliminaciones. Versiones, entrypoints
y marcadores ngcc permanecieron intactos; no hubo transformaciones View Engine.

Esta evidencia pertenece exclusivamente a Jest en la instalación raw TEMP.
No demuestra ausencia de ejecución ngcc en Webpack.

## Validación de Jest y compilador

Resultados medidos y aceptados; no repetidos durante el cierre:

| Gate | Resultado | Duración total |
| --- | --- | ---: |
| Focal de traducciones TEMP | 7 suites / 42 tests aprobados / 0 fallos / 0 omitidos | 19,35 s |
| Jest completo TEMP | 84 suites / 316 tests aprobados / 0 fallos / 0 omitidos | 57,57 s |
| ngc del workspace | Verde; 0 diagnósticos | 12,74 s |

La ejecución raw sin ngcc es el gate principal de 8J6B. No se duplicó sobre
node_modules del workspace: la copia contiene el commit base y el mismo único
cambio de configuración, sin modificar specs ni mocks.

## Webpack productivo, linker y assets

Build productivo verde: 73 artefactos, 9 warnings y 65,79 s.
Confirma no-regresión del build; no prueba ausencia de ngcc interno.

Babel Angular linker sigue operativo, con cero declaraciones partial-Ivy sin
enlazar. Se preservan todos sus includes y la configuración Webpack.
Index: 7/7 referencias presentes. Workbox: 53/53 presentes. Assets: 26.
`i18n/es.json` válido y cero apariciones de `[object Module]`.

## Desarrollo y deuda F-B

El desarrollo canónico reprodujo el bloqueo histórico de eslint-loader en
`logs.component.ts`:

```text
Parsing error: Cannot read property 'map' of undefined
```

Se clasifica como deuda legacy de lint F-B, no como regresión 8J6B.
El aislamiento temporal mínimo afectó exclusivamente a
`node_modules/eslint-loader/dist/cjs.js`, con respaldo exacto en TEMP.

Desarrollo aislado: verde, exit 0, duración total 31,48 s, compilación 25,86 s,
cero errores, 7 warnings históricos, 2 bundles y 19 chunks.
Entre los warnings permanece `Conflicting values for 'process.env.NODE_ENV'`.

## Restauración y limpieza

eslint-loader se restauró inmediatamente desde el respaldo original:
84 bytes antes y después, SHA-256 coincidente:

```text
D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2
```

Aislamiento temporal retirado; F-B continúa diferido. No se repitió el desarrollo
canónico tras restaurar el original. TEMP 8J6B fue eliminado, incluidos copia raw,
instalación limpia, caché exclusiva, snapshots, sentinel, logs, helpers, respaldos
y Node portable propios. No se recreó durante el cierre. Se conservan node_modules
del workspace, Java, cachés globales, recursos Docker ajenos y ramas readiness.

## Contratos inmutables e integridad

Los siete contratos congelados de 8J5B conservan identidad Git respecto a la base,
con diff vacío y expectativas sin cambios. La comparación usa contenido Git,
independientemente de conversiones físicas LF/CRLF:

- `shared/jhipster-compat/translate-runtime-contract.spec.ts`
- `shared/jhipster-compat/translate-loader.spec.ts`
- `shared/jhipster-compat/missing-translation-handler.spec.ts`
- `shared/jhipster-compat/language.service.spec.ts`
- `shared/jhipster-compat/template/translate.directive.spec.ts`
- `shared/jhipster-compat/alert.service.spec.ts`
- `layouts/main/main.component.spec.ts`

Todos se encuentran bajo `src/test/javascript/spec/app/`.
El cambio técnico sigue siendo una única línea eliminada en jest.conf.js;
el documento es el único archivo nuevo. Sin cambios en src/main, specs, paquetes,
lockfile, Webpack, backend, pom.xml ni CI. No se registran credenciales ni secretos.

## Runtime y validación manual

No requeridos: solo cambia la inicialización de tests, sin cambios productivos,
paquetes runtime, traducciones, templates, autenticación, Webpack ni backend.
No se inició Docker, PostgreSQL ni un entorno manual para cerrar la etapa.

## Conclusiones sobre ngcc y Angular linker

| Ámbito | Conclusión |
| --- | --- |
| Bibliotecas Angular actuales que requieren ngcc | 0 |
| globalSetup ngcc explícito de Jest | Eliminado |
| Carga/ejecución ngcc durante Jest limpio | 0 |
| Integración ngcc interna de AngularWebpackPlugin 15 | Presente |
| Retirada global ngcc | No completada |
| Angular Babel linker | Sigue requerido para partial-Ivy |

No se amputan archivos ngcc de compiler-cli ni se parchea AngularWebpackPlugin.
Retirar ngcc y retirar el linker no son equivalentes.

## Angular 16 y siguiente etapa

Angular 16 no está listo. Faltan investigación de la integración interna ngcc de
AngularWebpackPlugin, estrategia de salida segura, modernización Node/toolchain
y evaluación específica Angular 16.

Siguiente unidad recomendada: **8J6C — investigación de salida de ngcc de
AngularWebpackPlugin**, primero en modo lectura. No iniciada. No se propone un
parche permanente de node_modules ni retirar el linker o actualizar Angular sin
la investigación previa correspondiente.

## Conclusión

Inicialización ngcc de Jest eliminada y gates técnicos verdes.
Retirada global ngcc no completada. Backend CI postintegración se comprueba
separadamente sobre el nuevo commit y no sustituye la reproducción TEMP,
el sentinel, Jest, ngc ni Webpack ya aceptados.
