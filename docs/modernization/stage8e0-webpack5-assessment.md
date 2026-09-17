# Etapa 8E0 — Assessment de migración Webpack 4 a Webpack 5

## Bloqueo

Angular 12 no se inició. `@ngtools/webpack` 12.2.18 exige el peer
`webpack ^5.30.0`, mientras el proyecto usa Webpack 4.41.2. No es un ajuste de
lockfile: afecta al compilador Angular, al servidor de desarrollo y a una
configuración JHipster personalizada.

Este assessment no modifica `package.json`, `package-lock.json`, configuración
Webpack, código, ESLint, backend ni CI.

## Build actual

El build es JHipster histórico personalizado, no Angular CLI estándar. Los
scripts invocan Webpack directamente y producción escribe en
`target/classes/static`.

| Archivo | Función | Perfil | Importa de |
|---|---|---|---|
| `webpack/webpack.common.js` | Resolve, reglas, Angular compiler, assets y HTML | Dev/prod | Webpack, ngtools, Copy, HTML, Merge JSON |
| `webpack/webpack.dev.js` | Dev server, lint pre-loader, BrowserSync y HMR | Dev | Common, merge y plugins dev |
| `webpack/webpack.prod.js` | CSS, minificación, Workbox y análisis | Prod | Common, merge y plugins prod |
| `webpack/utils.js` | Raíz y aliases TS a Webpack | Dev/prod | `path`, `tsconfig.json` |

| Entry | Archivo(s) | Uso |
|---|---|---|
| `main` | `src/main/webapp/app/app.main` | Aplicación Angular |
| `global` | `src/main/webapp/content/scss/global.scss` | Estilos globales |
| `polyfills` | Configuración Angular/JHipster histórica | Orden HTML y bootstrap Angular |

Dev genera `app/[name].bundle.js` y `app/[id].chunk.js`; prod usa hashes de
compilación y `content/[name].[contenthash].css`. `HtmlWebpackPlugin` conserva
el orden manual `polyfills`, `main`, `global`. Resolve declara `.ts` y `.js`,
`node_modules`, `es2015/browser/module/main` y aliases de TS. No existe
`resolve.fallback`.

## Node core y polyfills

No hay imports directos de módulos Node core en la aplicación. `path` se usa
solo en archivos de configuración; `process.env` se inyecta con DefinePlugin.
Las dependencias transitivas deberán comprobarse con el primer build Webpack 5:
Webpack 5 deja de polyfill automáticamente módulos Node core.

| Módulo | Uso conocido | Riesgo Webpack 5 |
|---|---|---|
| `path` | Solo tooling | Bajo |
| `buffer`, `crypto`, `stream`, `util`, `assert`, `url`, `querystring`, `os`, `fs` | Sin import directo | Medio: comprobar transitivas |
| `process` | DefinePlugin / build | Bajo, verificar bundle |

## Angular, Ivy y ngcc

| Paquete | Versión | Peer Webpack | Consecuencia |
|---|---:|---|---|
| `@ngtools/webpack` actual | 11.2.19 | `^4.0.0` | Angular 11 + Webpack 5 no está soportado |
| `@ngtools/webpack` candidato | 12.2.18 | `^5.30.0` | Angular 12 y Webpack 5 deben ir coordinados |

La configuración actual instancia `AngularCompilerPlugin` con `mainPath`,
`tsConfigPath` y `sourceMap`. La transición a ngtools 12 debe adaptar el
plugin/API equivalente y validar Ivy/ngcc, sin parchear `node_modules`.

## Loaders

| Loader | Versión | Uso | Estado Webpack 5 | Acción futura |
|---|---:|---|---|---|
| `@ngtools/webpack` | 11.2.19 | Compilación Angular | P0 | Migración coordinada a 12.2.18 |
| `eslint-loader` | 3.0.3 | Solo pre-regla dev | P1, deprecado y falla con TS 4 | Separar de bundling en etapa acotada |
| `file-loader` | 5.0.2 | Imágenes, fuentes, manifest | P2 | Mantener si compila; Asset Modules después |
| `html-loader` | 0.5.5 | Templates no índice | P1/P2 | Validar opciones |
| `sass-loader` | 8.0.0 | SCSS | P1 | Actualizar si el build lo exige |
| `css-loader`, `postcss-loader`, `style-loader`, `to-string-loader` | 3.3.2 / 3.0.0 / 1.0.1 / 1.1.6 | CSS/SCSS | P1/P2 | Validar por perfil |
| `thread-loader`, `ts-loader` | 2.1.3 / 6.2.1 | Tooling | P2 | No tocar sin evidencia |

## Plugins y APIs Webpack 4

| Plugin/API | Versión | Uso | Riesgo Webpack 5 | Acción |
|---|---:|---|---|---|
| CopyWebpackPlugin | 5.1.1 | Assets y Swagger | P0 | Actualizar y adaptar patrones |
| HtmlWebpackPlugin | 3.2.0 | Índice/chunks | P0 | Actualizar y verificar orden |
| webpack-merge | 4.2.2 | Une perfiles | P0 | Adaptar API v5 |
| MiniCssExtractPlugin | 0.8.0 | CSS prod | P0 | Actualizar |
| OptimizeCSSAssetsPlugin | 5.0.3 | CSS prod | P0 | Sustituir por minimizador compatible |
| TerserPlugin | 2.3.0 | JS prod | P0 | Actualizar a línea v5 |
| WorkboxPlugin | 4.3.1 | Service worker | P1 | Actualizar y validar assets |
| BrowserSyncPlugin/write-file | 2.2.2 / 4.5.1 | Dev | P1 | Validar watch/proxy |
| LoaderOptionsPlugin | core v4 | Flags legacy prod | P0 | Retirar o adaptar |
| WatchIgnorePlugin | core v4 | Ignora `src/test` | P0 | Adaptar firma de opciones |
| DefinePlugin/ContextReplacementPlugin | core | Variables/Angular | P2 | Conservar y validar |

No hay `NamedModulesPlugin`, `HashedModuleIdsPlugin`, `CommonsChunkPlugin` ni
`splitChunks` personalizado. La optimización fija `runtimeChunk: false` y
minimizers explícitos; los defaults Webpack 5 se deben comprobar con gates.

## Dev server, proxy y ESLint

`webpack-dev-server` 3.9.0 se lanza con `--inline`, `--hot` y
`--watch-content-base`. Usa `contentBase`, proxy a `localhost:8080`,
`historyApiFallback`, HMR y BrowserSync en `localhost:9000` contra Webpack en
`localhost:9060`. El proxy cubre `/api`, `/services`, `/management`,
`/swagger-resources`, `/v2/api-docs`, `/h2-console` y `/auth`.

| Setting | Actual | Cambio futuro |
|---|---|---|
| Estáticos | `contentBase` | `static` en dev-server 4 |
| Watch | `--watch-content-base` | `static.watch` |
| Cliente/HMR | `--inline --hot` | API/CLI dev-server 4 |
| Proxy | Array de contextos | Validar sintaxis v4 |
| BrowserSync | 9000 -> 9060 | Validar plugin y mantener proxy |

`eslint-loader` aparece solo en dev, no en prod ni Jest. Aunque su peer permite
Webpack 5, está deprecado y ya falla con TypeScript 4 por tooling histórico.
Recuperar dev server requiere una etapa que desacople lint del bundling o
sustituya el plugin, sin eliminar lint como control. F-B continúa **DEFERRED**
según 8D1.

## Acoplamiento JHipster

| Componente | Generado | Personalización | Riesgo |
|---|---|---|---|
| Needles assets/i18n/Moment | Sí | Idioma `es`, assets propios | Alto al regenerar |
| Output `target/classes/static` | Sí | Integrado con backend | Alto contractual |
| Proxy, BrowserSync, notifier | Histórico | Puertos y TLS | Alto en dev |
| Angular compiler y aliases | Histórico | `app.main.ts`, tsconfig | P0 |
| Swagger, manifest, contenido | Parcial | Rutas/archivos propios | P0 con CopyPlugin |

## Versiones candidatas y Node/npm

| Tool | Candidato | Peer / Node mínimo | Decisión |
|---|---:|---|---|
| webpack | 5.30.0 | Requerido por ngtools 12; Node >=10.13 | Mínimo compatible |
| webpack-cli | 4.9.2 | Webpack 4/5; Node >=10.13 | Compatible |
| webpack-dev-server | 4.15.2 | Webpack 4/5; Node >=12.13 | Línea v4 compatible con Node 12.16 |
| @ngtools/webpack | 12.2.18 | Webpack ^5.30; Node ^12.14.1 | Requerido por Angular 12 |
| TypeScript | 4.3.5 | ngtools ~4.2.3 o ~4.3.2 | Compatible |
| ng-bootstrap | 10.0.0 | Angular ^12; Bootstrap 4.5 | Mantiene CSS Bootstrap 4 |

npm 6.14.2 no instala peers estrictamente: una futura etapa debe declarar el
conjunto explícito y demostrar dos `npm ci` limpios. No hay evidencia para
cambiar npm ni Node.

## P0/P1/P2/P3 y estrategia

### P0 — instalación y producción

1. ngtools/Angular compiler y peer Webpack 5.
2. Copy, HTML, merge, MiniCss, Terser y minimizador CSS compatibles.
3. LoaderOptionsPlugin, WatchIgnorePlugin y reglas/API Webpack 4.
4. Cualquier core Node transitivo que el build señale.

### P1 — dev server

1. Configuración y CLI de dev-server 3 a 4.
2. BrowserSync, write-file y proxy.
3. Decisión explícita sobre `eslint-loader` fuera de la modernización ESLint.

### P2 — mantenible inicialmente

- file-loader y otros loaders si el build Webpack 5 los acepta.
- ContextReplacement/Define, Moment locales, analyzer y notifier.

### P3 — posterior

- Asset Modules, caché persistente, IDs deterministas y rendimiento.
- ESLint, Protractor, Moment y reducción JHipster.

La estrategia elegida es **B**: Webpack 5 y Angular 12 deben migrarse de forma
coordinada. Estrategia A no es viable porque ngtools 11.2.19 declara Webpack
4 y ngtools 12.2.18 exige Webpack 5.

## Gates propuestos

| Gate | Objetivo |
|---|---|
| W-A | Dos `npm ci` limpios con Node 12.16.1/npm 6.14.2 |
| W-BT | Angular, TypeScript, templates, Ivy y ngcc verdes |
| W-C | 60 suites y 181 tests sin regresión |
| W-D | Producción y `target/classes/static` reproducible |
| W-E | Smoke del artefacto y contrato backend |
| W-DEV | Dev server/proxy tras decidir eslint-loader |
| W-DIFF | Diff limitado, sin workarounds ni backend/CI |

## Próximo paso

Crear una etapa explícita de **migración coordinada Webpack 5 + Angular 12**.
Debe resolver P0 uno a uno y mantener separado el dev server/lint del build de
producción. No iniciar Angular 13.
