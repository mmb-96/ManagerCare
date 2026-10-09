# Etapa 8H4 — validación completa de Angular 15

## Alcance y base

Esta etapa valida la migración a Angular 15 desde la base `876ba56eef5dc696aa5fe2bafd1c47eb93f513a5`. Su único cambio permanente de dependencias es Webpack `5.54.0` a `5.75.0`.

## Stack final

| Componente | Versión validada |
| --- | --- |
| Angular | 15.2.10 |
| Angular CLI | 15.2.11 |
| `@ngtools/webpack` | 15.2.11 |
| TypeScript | 4.8.4 |
| webpack | 5.75.0 |
| `webpack-cli` | 4.10.0 |
| `webpack-dev-server` | 4.15.2 |
| Node.js | 14.21.3 |
| npm | 6.14.18 |
| `ng-bootstrap` | 14.2.0 |
| Bootstrap | 5.2.3 |
| `ng-jhipster` | 0.12.0 |

`package-lock.json` conserva lockfile versión 1. El objetivo TypeScript se mantiene en `ES2022` y `useDefineForClassFields` se mantiene en `false`.

## Regresión de ejecución en desarrollo

El fallo inicial en desarrollo era `Uncaught ReferenceError: i0 is not defined`. El JavaScript emitido por `@ngtools/webpack` era estructuralmente correcto; la pérdida ocurría en el procesamiento final de Webpack 5.54.0.

Angular 15 con ES2022 usa inicialización estática de clase para metadatos Ivy. En la forma afectada, Webpack 5.54.0 detectaba `HarmonyImportSideEffectDependency` pero no retenía los enlaces `HarmonyImportSpecifierDependency` necesarios para los símbolos usados en esos bloques estáticos. La factoría final dejaba referencias libres como `i0`, `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `NgbModule`, `NgJhipsterModule` y `TranslateModule`.

Esto queda documentado como una **incompatibilidad estructural local reproducida entre el análisis de desarrollo de Webpack 5.54 y la forma de salida Ivy estática ES2022 de Angular 15**. No se afirma que sea un bug confirmado de Webpack aguas arriba.

## Investigación causal

| Experimento | Resultado |
| --- | --- |
| R2 — `ContextReplacementPlugin` | No causal |
| R3 — `eval-source-map` | No causal |
| R4 — `eslint-loader` | No causal para `i0` |
| R5 — salida de `@ngtools/webpack` | Válida; el procesamiento final de Webpack perdía enlaces |
| R6 — `concatenateModules` | No causal |
| R7 — `sideEffects` | No causal |
| R8 — `innerGraph` | Activo, pero no causal |
| R9 / R9-R1 / R9-R2 — objetivo ES2021 temporal | Solo workaround de diagnóstico |

El diagnóstico ES2021 cambió la forma emitida de bloques estáticos de clase a asignaciones posteriores a la clase. Restauró los enlaces `HarmonyImportSpecifierDependency` y produjo una ejecución manual válida, demostrando la diferencia estructural relevante. No se conserva como workaround permanente.

## Corrección de compatibilidad permanente

Se seleccionó Webpack `5.75.0` porque mantiene el objetivo oficial Angular 15 ES2022 y funciona con `@ngtools/webpack` 15.2.11, Node.js 14.21.3, `webpack-cli` 4.10.0 y `webpack-dev-server` 4.15.2. Su parser maneja la forma `StaticBlock` necesaria y preserva los enlaces Ivy.

No se modificaron Angular, TypeScript, Node.js, npm, ESLint, `@typescript-eslint`, `eslint-loader`, `webpack-cli` ni `webpack-dev-server`.

El cierre aceptado del lockfile queda limitado a la actualización de Webpack y sus resoluciones transitivas compatibles: `@types/estree` 0.0.50 a 0.0.51, `acorn` 8.18.0 a 8.19.0, `caniuse-lite` 1.0.30001814 a 1.0.30001815, `electron-to-chromium` 1.5.444 a 1.5.451 y `node-releases` 2.0.57 a 2.0.58.

## Gates técnicos

| Gate | Resultado |
| --- | --- |
| `npm ci` | Verde |
| `ngcc` | Verde; `ng-jhipster` 0.12.0 procesado sin bloqueo |
| `ngc` | Verde; 0 diagnósticos |
| Jest | 60 suites, 181 pruebas, 0 fallos |
| Webpack de producción | Verde |
| Pipeline de aplicación en desarrollo | Verde con F-B legacy lint aislado solo en memoria |
| Estructura Webpack 5.75 + ES2022 | Verde |
| Enlace Ivy `i0` / referencias libres | Válido / ausentes |
| `[object Module]` | 0 |
| `css-loader` | `esModule: false` |
| Static smoke | Verde |
| Recursos Workbox | 0 ausentes |
| `i18n/es.json` | Válido |
| Assets copiados | Presentes |

El build de producción contiene 73 archivos regulares. Difiere del baseline Angular 15/Webpack 5.54 de 55, pero todas las referencias de `index.html`, las entradas Workbox, los assets copiados y las comprobaciones static smoke fueron válidas. La diferencia de recuento no está completamente explicada y no bloquea al estar validada la salida funcional.

## Validación visual

| Comprobación | Resultado |
| --- | --- |
| A — Navbar pública | Pass |
| B — Login | Pass |
| C — Navbar autenticada | Pass |
| D — Modal real `ng-bootstrap` Health → Database | Pass |
| E — Gestión de usuarios / paginación | Pass |
| F — `NgbDatepicker` | NOT TESTABLE — NO ACTUAL `ngbDatepicker` TEMPLATE USAGE |
| G — Tooltip Tipo/Categoría | Pass |
| H — Navbar móvil, aproximadamente 360 px | Pass |
| I — Modal Health móvil, aproximadamente 360 px | Pass |
| J — Tablet, aproximadamente 760 px | Pass |
| K — Tablas / badges | Pass |
| L — Consola / red | Pass |

`Uncaught ReferenceError: i0 is not defined` está ausente, la interfaz Angular es visible y el fallback JHipster está ausente. La compatibilidad de Moment adapter / fechas `ng-bootstrap` está verde en compilación; un datepicker no puede declararse aprobado sin uso real de plantilla.

## Deuda diferida

- **F-B legacy ESLint:** la configuración canónica de desarrollo conserva deuda de `eslint-loader` 3.0.3. Se observaron `@typescript-eslint/tslint/config`, `Must use import to load ES Module` y, en algunos experimentos, `Parsing error: Cannot read property 'map' of undefined`. No causa la regresión original `i0`. No se hizo ningún cambio permanente de ESLint.
- **Traducción SSL H2 en Health:** `translation-not-found[health.indicators.ssl]` es deriva histórica previa a i18n. No bloquea y está fuera de alcance; Database, espacio en disco y Application se muestran correctamente.
- **A1 Audits date inputs:** comportamiento nativo del navegador; fuera de alcance.
- **F-F E2E:** Protractor / ChromeDriver 114 frente a Chrome 153 sigue siendo deuda histórica de tooling no bloqueante.
- **`ng-jhipster` 0.12.0:** Angular 15 funciona mediante el puente de compatibilidad `ngcc`. Su desacoplamiento o reemplazo es obligatorio antes de Angular 16.
- **Runtime Node.js:** debe modernizarse antes de Angular 16.

## Conclusión

**ANGULAR 15 FULL VALIDATION GREEN**

**WEBPACK 5.75 ES2022 COMPATIBILITY FIX VALIDATED**

**ANGULAR 15 MODERNIZATION STAGE 8H COMPLETE**

La siguiente evaluación recomendada es **8I0 — ng-jhipster decoupling readiness**. No se inicia en esta etapa.
