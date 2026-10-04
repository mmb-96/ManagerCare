# Etapa 8G1 - puente Bootstrap 5 sobre Angular 13

## Alcance y base

Base: `master` en `1b3fea7e29198fb711a5c5b54c77fd1efa625a46`.

La etapa mantiene Angular `13.3.12`, TypeScript `4.6.4`, RxJS, Webpack 5,
Jest 27, `jest-preset-angular` 11 y Jasmine 2. No introduce Angular 14 ni
actualiza el tooling fuera del puente de componentes y estilos Bootstrap.

## Dependencias

Se actualizan únicamente las dependencias directas necesarias:

- `@ng-bootstrap/ng-bootstrap`: `11.0.1` a `12.1.2`;
- `bootstrap`: `4.4.1` a `5.0.0`;
- `@popperjs/core`: `2.10.2` añadido explícitamente.

`package-lock.json` se regeneró con Node `14.21.3` y npm `6.14.18`, conserva
`lockfileVersion: 1` y no contiene churn ajeno. La instalación limpia se hizo
con `npm ci --ignore-scripts`, por lo que no se ejecutó el postinstall histórico
ni se descargaron artefactos WebDriver.

`npm ls` conserva un aviso de peer heredado: `ng-jhipster@0.12.0` declara
ng-bootstrap `^5.1.0`. No se modificó ng-jhipster; ngcc, ngc, pruebas y build
demuestran que no bloquea este puente de Angular 13.

## Adaptación de marcado y Sass

No se añade Bootstrap JavaScript, jQuery ni inicialización manual de Popper.
La aplicación sigue usando interacciones Angular y ng-bootstrap.

- Formularios: `form-group` pasa a `mb-3` y `form-control-label` a
  `form-label`, preservando controles, bindings y validaciones.
- Navbar: se sustituyó `ml-auto` por `ms-auto` y se retiraron atributos
  `data-toggle`/`data-target` inertes; se conserva `toggleNavbar()` y
  `ngbCollapse`.
- Modales: los diez diálogos de cierre/borrado y el login usan `btn-close`;
  se conservaron sus manejadores Angular (`cancel()`/`dismiss()`) y no se
  añadió `data-bs-dismiss`.
- Utilidades: se migraron alineación, flotado y badges a sus equivalentes
  lógicos Bootstrap 5.
- Auditoría: se eliminaron los wrappers `input-group-prepend` y
  `input-group-append`; los `input-group-text` permanecen en el mismo grupo.
- Sass: se retiraron solo las tres variables Bootstrap 4 eliminadas
  (`$enable-hover-media-query`, `$enable-grid-classes` y
  `$enable-print-styles`).

No hubo cambios TypeScript, servicios, contratos REST, JWT, backend ni ESLint.
Webpack solo cambia de forma localizada el pipeline SCSS de componentes
descrito en la incidencia V1.

## Validación técnica

Con el runtime temporal Node `14.21.3` / npm `6.14.18`:

| Gate | Resultado |
| --- | --- |
| instalación limpia | verde, scripts desactivados |
| ngcc | verde; procesa los paquetes View Engine heredados, incluido ng-jhipster |
| ngc | verde, sin diagnósticos TypeScript ni Angular |
| Jest | 60 suites, 181 pruebas verdes |
| build de producción | verde; 73 artefactos estáticos |
| smoke estático | `index.html`, JavaScript principal y CSS principal responden 200 |
| A13DEV | pendiente técnico heredado de lint, documentado abajo |

El build de producción conserva avisos no bloqueantes ya conocidos: base de
Browserslist desactualizada, APIs deprecadas de Webpack y tamaño de bundles.
También se mantiene el aviso de configuración de ts-jest sobre
`esModuleInterop`.

### A13DEV: lint heredado

La compilación de desarrollo alcanza Webpack y reproduce la deuda conocida de
lint: `eslint-loader` con `@typescript-eslint` 2 no puede cargar el compilador
Angular ESM y termina con el error de parseo en `admin/logs/logs.component.ts`.
No es un diagnóstico de TypeScript, template, Bootstrap ni de código funcional
de ManagerCare. Esta etapa no modifica ESLint ni sus dependencias.

## BS-VISUAL Fase 1 — validada por el usuario

**BS-VISUAL Fase 1: ✅ USER VALIDATED.** La revisión manual sin backend cubrió
la página inicial, navbar y dropdown Cuenta, login, Registro y reset de
contraseña en escritorio; navbar colapsada y expandida con dropdown Cuenta en
tablet; y las mismas superficies públicas en móvil.

Las superficies cubiertas en Fase 1 fueron:

1. navbar en escritorio y móvil, incluyendo apertura/cierre Angular;
2. login, registro, ajustes y flujos de contraseña;
3. controles de formulario, validaciones y foco;
4. paginación, tablas, badges y alineaciones;
5. modal de salud y los diálogos de borrado, con sus botones cancelar/cerrar;
6. filtros de auditoría con ambos campos de fecha;
7. responsive y contraste básico de las pantallas anteriores.

La prueba funcional contra backend (F-B) queda diferida y la suite E2E
Protractor/ChromeDriver (F-F) sigue fuera del alcance por la deuda de tooling
legacy. No se usa esa ausencia como evidencia de regresión funcional.

### Incidencia V1: indicador de fortaleza de contraseña — resuelta

La primera revisión visual detectó en Registro, tanto en escritorio como en
móvil, que los cinco segmentos del indicador aparecían como viñetas negras en
vertical. El problema era local: el estilo Sass seleccionaba `ul#strength`,
pero el marcado real usa `ul#strengthBar`, por lo que no se aplicaban el reset
de lista ni el diseño horizontal de los segmentos. La corrección de ese
selector era necesaria, pero no suficiente: el primer recheck mostró que el
estilo encapsulado seguía sin llegar al navegador.

La causa definitiva fue la interoperabilidad del pipeline Webpack 5 de estilos
de componente: `css-loader` entregaba un ES module a `to-string-loader`, que
acababa inyectando `"[object Module]"` como estilo Angular. Se añadió
`esModule: false` exclusivamente a las cadenas SCSS de componentes que usan
`to-string-loader`, tanto en desarrollo como en producción. No se alteraron
las cadenas de estilos globales. El bundle debe volver a contener el CSS real
del componente, conservando los cinco segmentos, sus colores calculados y el
comportamiento responsive.

El recheck manual confirmó los cinco segmentos horizontales sin viñetas, su
respuesta de color según la fortaleza y el comportamiento responsive en
escritorio y móvil. **V1 password-strength: ✅ RESUELTO.**

## BS-VISUAL Fase 2 — validada por el usuario

**BS-VISUAL Fase 2 Desktop: ✅ USER VALIDATED.** Con backend real y
autenticación se revisaron Inicio, navbar autenticada, gestión de usuarios,
Health y modal Database, Configuración, y los listados, detalles, formularios
y modales de Categoría, Categoría ascendente, Objetivo, Tipo, User Extra,
Objetivos conseguidos y Puntos conseguidos. No se realizó ningún borrado real.

**BS-VISUAL Fase 2 Tablet: ✅ USER VALIDATED.** Sobre Health autenticado a
unos 760 px se validaron navbar colapsada, título, acción Refrescar, tabla,
estados, detalles y badges, sin solapes.

**BS-VISUAL Fase 2 Mobile: ✅ USER VALIDATED.** Sobre Health autenticado a
unos 360 px se validaron navbar colapsada, título y Refrescar; la tabla usa el
overflow horizontal previsto, con Estado, Detalles, badges e iconos accesibles
y sin solapes destructivos.

### H1 — Health status badge

La clasificación de H1 es **R2**: el marcado histórico conserva un `span`
con `badge` y la lógica devolvía `badge-success` para `UP` y `badge-danger`
para los demás estados. Bootstrap 5 eliminó esas variantes contextuales de
badge, por lo que el color blanco base del componente dejó de tener fondo.

La corrección localizada de 8G1c conserva el marcado y la lógica condicional,
pero sustituye las dos clases por sus equivalentes Bootstrap 5: `bg-success` y
`bg-danger`. El CSS de Bootstrap 5 mantiene contraste legible para las dos
variantes utilizadas; no se añadió una clase de texto preventiva. La prueba
focal existente de `HealthComponent` se actualizó con esos dos valores.

La revisión manual posterior confirmó Database, Espacio en disco, Application
y SSL como `LEVANTADO` con badge verde legible y tabla correcta.
**H1: R2 — ✅ CORRECTED / ✅ USER VALIDATED.**

### H2 — Health SSL translation

H2 se clasifica como **PRE-I18N**. La traducción de `ssl` y el tipo frontend
correspondiente ya faltaban en la base anterior a 8G1, mientras el backend
actual expone ese indicador. Es deuda previa fuera de alcance: no se añadió
traducción ni se alteró el backend.

### A1 — Filtros de fecha de Auditorías

A1 se clasifica como **NATIVE**. La estructura de `input-group` migrada usa
el marcado requerido por Bootstrap 5 y no se demostró una regresión de ancho.
La proximidad al icono es propia del control `type=date` y del espacio
disponible. No se modificaron Auditorías, tamaños ni estilos.

## Resultado y deuda siguiente

El puente Bootstrap 5 está completado sobre Angular `13.3.12`, con
ng-bootstrap `12.1.2`, Bootstrap `5.0.0`, Popper `2.10.2` y Webpack `5.30.0`.
La validación técnica y BS-VISUAL global están **✅ USER VALIDATED**.

Permanecen deliberadamente fuera de alcance: F-B/ESLint heredado conforme a
`stage8d1-lint-decoupling.md`, F-F/Protractor y su ChromeDriver histórico, H2
PRE-I18N y A1 NATIVE. No se inicia Angular 14 en esta etapa.
