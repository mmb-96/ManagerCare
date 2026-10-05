# Stage 8H3 — Angular 15 official migrations

## Base

`master` antes de esta etapa: `2de49c8f520a1aaf30402245fa46e4bb2f3be139`.

## Objetivo

Inventariar y contabilizar las migraciones oficiales de Angular 15 aplicables al
workspace custom de ManagerCare y materializar únicamente los cambios realmente
aplicables.

## Restricción del workspace

`angular.json` mantiene `architect` vacío porque el build principal usa Webpack
custom. Por ello, las migraciones Core que buscan `tsConfig` en targets `build`
o `test` no pueden ejecutarse normalmente sobre este workspace.

## Discovery

El análisis se realizó con tooling local: `@angular/core` 15.2.10,
`@angular/cli` 15.2.11, `@schematics/angular` 15.2.11 y
`@angular-devkit/schematics` 15.2.11. El boundary revisado fue Core 14.2.12 a
15.2.10 y CLI 14.2.13 a 15.2.11.

## Core migrations

| Migration | Classification | Reason |
| --- | --- | --- |
| `migration-v15-router-link-with-href` | NOT APPLICABLE TO CUSTOM WORKSPACE — STATICALLY VERIFIED NO TARGET USAGE | No hay builders CLI para localizar `tsConfig` y no se detectaron usos de `RouterLinkWithHref`. |
| `migration-v15-relative-link-resolution` | NOT APPLICABLE TO CUSTOM WORKSPACE — STATICALLY VERIFIED NO TARGET USAGE | No hay builders CLI para localizar `tsConfig` y no se detectaron usos de `relativeLinkResolution`. |

## CLI migrations

| Migration | Classification | Reason |
| --- | --- | --- |
| `remove-browserslist-config` | NOT APPLICABLE — NO PROJECT BROWSERSLIST CONFIG | No existe configuración Browserslist del proyecto. El error `Unknown browser query 'supports es6-module'` es una incompatibilidad ambiental no bloqueante. |
| `remove-platform-server-exports` | DRY-RUN VERIFIED NO-OP | No hay SSR ni exports de `renderModule` que modificar. |
| `update-typescript-target` | APPLIED VIA RESTRICTED LOCAL RUNNER | Es la única migración con diff aplicable. |
| `update-workspace-config` | DRY-RUN VERIFIED NO-OP | No hay builders oficiales de servidor que ajustar. |
| `update-karma-main-file` | DRY-RUN VERIFIED NO-OP | No hay builder Karma ni fichero principal aplicable. |

## Restricted execution

`update-typescript-target` se ejecutó individualmente mediante
`SchematicTestRunner` y `UnitTestTree`, con las colecciones locales de Angular
15. El Tree virtual se inspeccionó antes de materializar el único fichero
afectado. No se utilizó red, `ng update`, tareas npm ni instalación de paquetes.

## Applied migration

En `tsconfig.json`:

```text
target: es2020 -> ES2022
useDefineForClassFields: absent -> false
```

El schematic también reformateó los arrays `lib` y `paths`; sus valores y su
semántica se preservaron. No hubo otros cambios semánticos.

## Package integrity

- `package.json`: unchanged.
- `package-lock.json`: unchanged.
- Dependencies: unchanged.
- `angular.json`: unchanged.
- Source: unchanged.

## ngcc

GREEN. `ng-jhipster` no produjo errores bloqueantes.

## ngc

GREEN, salida 0 y cero diagnósticos.

## Production build

GREEN con Angular 15.2.10, TypeScript 4.8.4, `@ngtools/webpack` 15.2.11,
Webpack 5.54.0 y target ES2022. La clasificación es:

```text
ES2022 + CURRENT TERSER PIPELINE: COMPATIBLE
```

El build mantuvo `[object Module]` en cero ocurrencias problemáticas y
`css-loader` con `esModule: false`.

## Artifact count

La baseline histórica Angular 14 registró 73 artefactos. El build Angular
15/ES2022 de esta etapa registró 55.

```text
ARTIFACT COUNT CHANGE — PENDING 8H4 INVESTIGATION
```

No existe una baseline de production build inmediatamente posterior a 8H2, por
lo que no puede atribuirse el cambio exclusivamente a ES2022. 8H4 deberá hacer
un build limpio, inventariar tipos, nombres y funciones de los artefactos,
comprobar `index.html`, bundles referenciados y static smoke. No se exigirá
recuperar exactamente 73 si el toolchain combina o elimina outputs de forma
legítima.

## Pending validation

- Jest completo: 8H4.
- Static smoke: 8H4.
- Validación visual dirigida: 8H4.
- Inventario de artefactos: 8H4.

## Migration conclusion

ALL APPLICABLE ANGULAR 15 MIGRATION CHANGES ACCOUNTED FOR.

8H3 queda con la migración aplicable de Angular 15 materializada, compilador y
production build verdes, lista para integración y con validación integral
pendiente en 8H4. No implica que todas las migraciones oficiales se hayan
ejecutado.
