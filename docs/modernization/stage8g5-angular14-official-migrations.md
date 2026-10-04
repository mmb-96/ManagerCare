# Stage 8G5 — Migraciones oficiales Angular 14

## Base

`master`: `62097f855ba7a179156ca1a80261729e078c31ae`

## Objetivo

Aplicar y validar las migraciones oficiales correspondientes al salto de Angular 13.3 a Angular 14.2 sobre el stack ya actualizado durante 8G2.

## 8G5A — Discovery

Se localizaron las colecciones oficiales de `@angular/core` y `@schematics/angular`, junto con las migraciones Core `migration-entry-components`, `migration-v14-typed-forms` y `migration-v14-path-match-type`, y las migraciones CLI aplicables. Esta fase no modificó archivos.

## 8G5B — Angular Core migrations

Se ejecutó:

```text
node node_modules/@angular/cli/bin/ng.js update @angular/core --migrate-only --from=13.3.12 --to=14.2.12
```

Resultado:

- `migration-entry-components`: NO-OP.
- `migration-v14-typed-forms`: NO-OP.
- `migration-v14-path-match-type`: NO-OP.
- Archivos modificados: 0.
- `ngc`: 0 diagnósticos.

Los formularios públicos que usan `FormBuilder` no requirieron cambios y los componentes estabilizados durante 8G2 mantienen el bridge deliberado mediante `UntypedFormBuilder`.

## 8G5C — ng update runner blocked

El intento de ejecutar `ng update @angular/cli --migrate-only` detectó una CLI instalada como obsoleta e intentó instalar temporalmente Angular CLI 22.2.1. Se detuvo antes de descargar o instalar paquetes.

Clasificación: **UPDATE RUNNER MECHANISM BLOCKED**.

No se modificaron archivos mediante ese intento.

## 8G5C-R1 — local migration runner

Se empleó exclusivamente el tooling local:

- `@schematics/angular`: 14.2.13.
- `@angular-devkit/schematics`: 14.2.13.
- Colección: `node_modules/@schematics/angular/migrations/migration-collection.json`.

Resultados de las migraciones CLI:

### update-angular-packages-version-prefix

- Dry-run: NO-OP.
- Ejecución real: bloqueada por una tarea interna `npm` registrada por el schematic.
- Clasificación: **DRY-RUN VERIFIED NO-OP — REAL EXECUTION BLOCKED BY INTERNAL PACKAGE INSTALL TASK**.
- `package.json`: sin cambios.
- `package-lock.json`: sin cambios.

### update-tsconfig-target

Aplicada en `tsconfig.json`: `es6` a `es2020`.

### remove-show-circular-dependencies-option

NO-OP.

### remove-default-project-option

Aplicada en `angular.json`: retirada de `defaultProject`.

### replace-default-collection-option

NO-OP.

### update-libraries-secondary-entrypoints

NO-OP.

## Final migration diff

Los únicos cambios de migración son:

- `angular.json`: retirada de `defaultProject`.
- `tsconfig.json`: `target` de `es6` a `es2020`.

No hay otros cambios de código, configuración de build, dependencias ni lockfile.

## Validation

- `ngcc`: GREEN.
- `ng-jhipster`: GREEN, sin error bloqueante.
- `ngc`: 0 diagnósticos.
- Jest: 60 suites, 181 tests, 0 failures, 0 errors, 0 skipped.
- `webpack:prod`: GREEN con Webpack 5.54.0.
- Artefactos generados: 73.
- Compatibilidad ES2020: confirmada.
- `[object Module]`: 0.
- `css-loader` con `esModule: false`: preservado.

## Static smoke

El primer intento se clasificó como **STATIC SMOKE INFRASTRUCTURE FAILURE**, sin evidencia de defecto del build. El reintento 8G5D-R1 terminó GREEN.

| Recurso | Estado |
|---|---:|
| `/` | 200 |
| `/index.html` | 200 |
| main JS | 200 |
| main CSS | 200 |
| SPA fallback | 200 |

## Visual validation

**NOT REQUIRED — NO UI SOURCE OR STYLE DIFF**.

La etapa solo modifica `angular.json` y `tsconfig.json`; no modifica componentes, plantillas, SCSS, Bootstrap, ng-bootstrap, routing, formularios, Webpack ni código funcional. La baseline visual completa de 8G2 permanece aplicable.

## Deferred/out of scope

- ESLint — DEFERRED.
- Protractor — NON-BLOCKING.
- H2 — PRE-I18N.
- A1 — NATIVE.
- node-releases — PRE-EXISTING TRANSITIVE ENGINE DEBT.
- typed forms modernization — DEFERRED.

## Conclusion

8G5: **OFFICIAL MIGRATIONS APPLIED**, **FULL VALIDATION GREEN**, **READY FOR INTEGRATION**.
