# Etapa 8E1 — Angular 12 y Webpack 5

## Base y resultado de producción

La rama parte de Angular 11.2.14 y Webpack 4.41.2. La migración coordinada deja Angular 12.2.17, CLI/ngtools 12.2.18, TypeScript 4.3.5, ng-bootstrap 10.0.0, Zone.js 0.11.4 y Webpack 5.30.0. RxJS permanece en 6.5.5.

| Área | Antes | Después |
| --- | --- | --- |
| Angular framework | 11.2.14 | 12.2.17 |
| CLI / ngtools | 11.2.19 | 12.2.18 |
| TypeScript | 4.0.8 | 4.3.5 |
| Webpack / CLI / dev server | 4.41.2 / 3.3.10 / 3.9.0 | 5.30.0 / 4.10.0 / 4.15.2 |
| ng-bootstrap | 9.1.3 | 10.0.0 |
| Workbox | 4.3.1 | 6.5.4 |

Node 12.16.1 y npm 6.14.2 portátiles regeneraron `package-lock.json` en formato 1. `npm ci --ignore-scripts` fue correcto dos veces desde un `node_modules` vacío; los scripts se desactivaron para no disparar la actualización legacy de WebDriver, fuera de alcance.

## Configuración Webpack

- `AngularCompilerPlugin` pasó a `AngularWebpackPlugin` con `tsconfig` y `directTemplateLoading`.
- CopyWebpackPlugin pasó a `patterns`; Swagger conserva el mismo destino plano y excluye `index.html`.
- WatchIgnorePlugin usa la sintaxis Webpack 5.
- `webpack-merge` usa su export `merge`.
- `optimize-css-assets-webpack-plugin` fue sustituido por `css-minimizer-webpack-plugin`; Terser conserva paralelismo y política de comentarios.
- LoaderOptionsPlugin se retiró porque Webpack 5 ya no lo expone.
- La exclusión de `index.html` para `html-loader` se hizo multiplataforma. Evita que la compilación hija procese el CSS de carga como JavaScript; los assets siguen copiándose por CopyWebpackPlugin.
- Workbox 4 no soportaba Webpack 5; Workbox 6.5.4 sí. No se añadieron polyfills de Node: el build no los solicitó.

## Gates

- F-B: **DEFERRED**, conforme a `stage8d1-lint-decoupling.md`.
- W-A: correcto y reproducible desde limpio.
- W-BT: `ngcc` y `ngc` correctos; cero errores TypeScript, Angular, plantilla e Ivy.
- W-C: 60 suites y 181 tests verdes.
- W-D: Webpack 5.30.0 correcto dos veces desde limpio, 73 archivos en `target/classes/static`.
- W-E: `index.html` y el bundle principal respondieron HTTP 200 en un servidor temporal loopback.
- W-DEV: el servidor llega a iniciarse y a compilar. El único error restante es `eslint-loader` legacy al analizar TypeScript 4, por lo que queda limitado exclusivamente por F-B **DEFERRED**.
- F-F: pendiente por la incompatibilidad histórica ChromeDriver 114 / Chrome 153.

## Compatibilidad del tooling del servidor de desarrollo

El lockfile resolvía `@webpack-cli/serve` 1.7.0 a través del rango `^1.6.1` de `webpack-cli` 4.9.2. El paquete `serve` invoca `cli.isMultipleCompiler`, una API que 4.9.2 no expone, por lo que W-DEV terminaba con `cli.isMultipleCompiler is not a function`.

La corrección mínima fue actualizar únicamente `webpack-cli` a 4.10.0. Mantiene compatibilidad con Node 12.16.1 y Webpack 5.30.0; el grafo efectivo queda en `webpack-cli` 4.10.0, `@webpack-cli/serve` 1.7.0 y `webpack-dev-server` 4.15.2. Tras una instalación limpia y `ngcc` local, W-DEV registró el proxy, el fallback SPA y completó la compilación inicial. La compatibilidad webpack-cli/dev-server queda **RESOLVED**; no se actualizó ni configuró ESLint, y el error de `eslint-loader` se mantiene como deuda F-B diferida.

## Warnings y deuda

Persisten `caniuse-lite` desactualizado, el deprecado de `[hash]` de Webpack 5, avisos Angular sobre `System.import`, y el rango declarado de `ts-jest` que no cubre TypeScript 4.3.5. No se corrigieron por no pertenecer al objetivo. La deuda inmediata sigue siendo F-B/`eslint-loader`; Angular 13 no debe iniciarse hasta revisarla.
