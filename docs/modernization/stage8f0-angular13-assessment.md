# Etapa 8F0 — assessment Angular 13

## Base

La base es `master` en `cd36b0e`, con Angular 12.2.17, TypeScript 4.3.5, RxJS 6.5.5, Zone.js 0.11.4, ng-bootstrap 10.0.0 y el Webpack JHipster personalizado ya migrado a Webpack 5.30.0. El output sigue siendo `target/classes/static`; `package-lock.json` usa lockfile v1.

La baseline funcional es W-A reproducible, W-BT verde, W-C con 60 suites/181 tests, W-D reproducible, W-E verde y W-DIFF sin workarounds. F-B permanece diferido por la deuda `eslint-loader`/TypeScript 4; F-F continúa bloqueado de forma no funcional por ChromeDriver 114 frente a Chrome 153.

## Compatibilidad Angular 13 y versiones candidatas

Angular 13.3/13.4 requiere Node `^12.20.0 || ^14.15.0 || ^16.10.0`, TypeScript `>=4.4.3 <4.7.0` y RxJS `^6.5.3 || ^7.4.0`.

| Paquete | Actual | Candidato para 8F1 |
| --- | --- | --- |
| `@angular/animations`, `common`, `compiler`, `core`, `forms`, `localize`, `platform-browser`, `platform-browser-dynamic`, `router` | 12.2.17 | 13.3.12 |
| `@angular/compiler-cli` | 12.2.17 | 13.3.12 |
| `@angular/cli` | 12.2.18 | 13.3.11 |
| `@ngtools/webpack` | 12.2.18 | 13.3.11 |
| `@angular-devkit/*` | transitivo CLI 12 | 13.3.11 / `0.1303.11` transitivo coherente |
| TypeScript | 4.3.5 | 4.6.4 |
| RxJS | 6.5.5 | mantener 6.5.5 |
| Zone.js | 0.11.4 | mantener 0.11.4 |

TypeScript 4.6.4 es la elección candidata: es una versión madura, sigue dentro del rango de Angular 13.3 y también es apta para Angular 14. TypeScript 4.4.x reduce el delta inmediato pero obliga a otro salto antes; 4.5.x es válida pero aporta menos margen que 4.6.4. La migración deberá validar estrictamente el compilador antes de modificar aplicación.

## Estrategia Node y npm

| Node | Angular 13 | Angular 14 | Angular 15 | npm incluido | Riesgo |
| --- | --- | --- | --- | --- | --- |
| 12.22.12 | sí | no | no | 6.14.16 | mínimo inmediato, pero obliga a otro runtime en la siguiente etapa |
| 14.21.3 | sí | sí | sí | 6.14.18 | recomendado: reutilizable y mantiene npm 6/lockfile v1 |
| 16.20.2 | sí | sí | sí | 8.19.4 | válido, pero cambia npm major y añade ruido sin ventaja para 8F1 |

La recomendación para 8F1 es Node 14.21.3 portátil con su npm 6.14.18. Angular CLI/ngtools 13.3.11 acepta npm 6.11+, por lo que no exige npm 7. El lockfile v1 puede mantenerse; la etapa no debe cambiar npm major ni regenerar el lockfile hasta que se aplique el cambio Angular autorizado.

## ng-bootstrap y Bootstrap

| Componente | Actual | Objetivo probable |
| --- | --- | --- |
| `@ng-bootstrap/ng-bootstrap` | 10.0.0 | 11.0.1 |
| Bootstrap CSS | 4.4.1 | 4.6.x, sujeto a validación visual posterior |

ng-bootstrap 11.0.1 declara peers Angular 13 y RxJS 6/7. La actualización CSS a Bootstrap 4.6 no forma parte de 8F1: puede afectar SCSS, variables, modals, tooltips, popovers, formularios, navbar y utilidades. Bootstrap 5/ng-bootstrap 12 queda fuera de alcance.

## View Engine, Ivy, APF y ngcc

Angular 13 elimina el soporte View Engine. Las bibliotecas publicadas como partial-Ivy deben procesarse por el Angular linker cuando se consume un build Webpack ajeno al builder CLI. El proyecto usa directamente `@ngtools/webpack`; no contiene `babel-loader`, regla Babel para JS/MJS/CJS de `node_modules` ni plugin `@angular/compiler-cli/linker/babel`.

El `ngcc` usado en Angular 12 no debe conservarse como respuesta automática: sirve para compatibilidad View Engine y no sustituye al linker de partial-Ivy. Para Angular 13, las bibliotecas View Engine son un riesgo de incompatibilidad y las partial-Ivy requieren linker en este pipeline custom.

| Uso ngcc | Actual | Angular 13 esperado |
| --- | --- | --- |
| Invocación manual tras `npm ci` | necesaria para la baseline Angular 12 | no usar como solución para View Engine; reevaluar solo con paquetes Ivy/partial-Ivy reales |
| `postinstall` | solo WebDriver histórico | sin cambio en 8F1 |

Configuración conceptual mínima, **no aplicada**:

```js
// regla adicional limitada a JavaScript distribuido por librerías Angular partial-Ivy
{
  test: /\.[cm]?js$/,
  include: [/* paquetes partial-Ivy confirmados */],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      compact: false,
      plugins: [require('@angular/compiler-cli/linker/babel')]
    }
  }
}
```

No debe aplicarse Babel a todo `node_modules`: el alcance debe basarse en los entry points partial-Ivy realmente instalados. Antes de implementar, una prueba temporal fuera del repositorio debe identificar esos paquetes y confirmar la regla para `.js`/`.mjs`/`.cjs`.

## Inventario de librerías Angular legacy

| Librería | Versión | Packaging observado | Angular 13 | Riesgo |
| --- | --- | --- | --- | --- |
| `ng-jhipster` | 0.12.0 | FESM5/FESM2015; peers Angular `^9` | no demostrado, peer incompatible | **P0** |
| `@ng-bootstrap/ng-bootstrap` | 10.0.0 | Angular package | sustituir por 11.0.1 | P1, acotado |
| `@ngx-translate/core` | 11.0.1 | FESM5/FESM2015; peer Angular `>=7` | no demostrado para 13 | P1 |
| `@ngx-translate/http-loader` | 4.0.0 | FESM5/FESM2015; peer Angular `>=7` | no demostrado para 13 | P1 |
| `ngx-webstorage` | 5.0.0 | FESM5/FESM2015; peers Angular `^9` | no demostrado | P1 |
| `ngx-cookie` | 4.0.2 | FESM5/FESM2015; peers legacy | no demostrado | P1 |
| `ngx-infinite-scroll` | 8.0.1 | ES2015 module | peer Angular `>=8` | P1 |
| `@fortawesome/angular-fontawesome` | 0.6.0 | FESM5/FESM2015; peer Angular `^9` | no demostrado | P1 |
| Font Awesome core/icons | 1.2.26 / 5.12.0 | JavaScript | no aplica Angular packaging | P2 |

`ng-jhipster` es el bloqueante principal: su peer Angular 9 y formato legacy impiden tratar Angular 13 como un simple upgrade de versiones. No se ha demostrado aún si fallará en instalación, linker o compilación, pero requiere una mini-etapa previa de compatibilidad o reemplazo autorizado.

## Webpack, ESM y package exports

`@ngtools/webpack` 13.3.11 declara peers `webpack ^5.30.0`, TypeScript `>=4.4.3 <4.7` y compiler-cli `^13.0.0`. Por tanto Webpack 5.30.0, webpack-cli 4.10.0 y webpack-dev-server 4.15.2 pueden mantenerse en principio; no se justifica actualizarlos por oportunidad.

Angular 13 introduce packaging ESM/APF moderno y `exports` con mayor frecuencia. La configuración actual no contiene reglas explícitas `.mjs`/`.cjs` ni Babel linker. Los imports de aplicación detectados son entry points públicos como `@angular/common/http` y `@angular/common/locales/es`; no se detectaron imports profundos a internals Angular. Riesgo: P1 para resolver formatos/exports durante A13-BT, no una razón para cambiar configuración ahora.

## Browser, TypeScript y testing

No existe `.browserslistrc` ni declaración `browserslist`; `polyfills.ts` solo importa `@angular/localize/init`. No se detectaron declaraciones IE11, `classlist.js`, `web-animations` ni differential loading. Angular 13 deja atrás el soporte legacy de Internet Explorer; el impacto es P2 documental/contractual y no autoriza retirar polyfills.

Los `tsconfig` relevantes usan `target: es6`, `module: esnext`, `moduleResolution: node` y `lib: ["es7", "dom"]`. No se ha encontrado una migration obligatoria estática para estos valores. Los riesgos TypeScript 4.4–4.6 se concentrarán en inferencia más estricta, flags de catch desconocido, index signatures y cambios de lib; deben descubrirse con A13-BT, sin `any`, `@ts-ignore` o cambios oportunistas.

Karma/Jasmine, Jest/ts-jest y Protractor no se actualizan en 8F1. ts-jest ya declara un rango inferior a TypeScript 4, por lo que W-C es un gate obligatorio. F-F sigue fuera de alcance por el desajuste ChromeDriver 114/Chrome 153.

## Dependabot y deuda F-B

La baseline Dependabot es Critical 13, High 97, Medium 69, Low 12; total 191, con 110 C/H y 47 paquetes C/H únicos. Las alertas directas Angular de `common`, `compiler` y `core` son candidatas a verse afectadas por 12→13; Moment continúa fuera de alcance. No se promete reducción.

La infraestructura del dev server ya funciona hasta lint. F-B (`eslint-loader`/`@typescript-eslint` legacy frente a TypeScript 4) permanece diferido y no debe reabrirse en 8F1.

## Clasificación y estrategia

### P0

- `ng-jhipster 0.12.0`: peer Angular 9 y formato legacy; confirmar compatibilidad Angular 13 o preparar una etapa específica autorizada.

### P1

- Confirmar linker partial-Ivy para Webpack custom y acotar la regla Babel a paquetes confirmados.
- Validar las librerías Angular legacy restantes y los formatos `.mjs`/`exports`.
- Actualizar ng-bootstrap a 11.0.1 y comprobar A13-BT/W-C.

### P2

- F-B diferido; soporte IE legacy no declarado; warnings ts-jest; Protractor/ChromeDriver.

### P3

- Bootstrap 4.6, RxJS 7, Bootstrap 5, Moment, reducción JHipster y limpieza de tooling.

La estrategia recomendada es **C**: una mini-etapa previa, `modernization/08f0a-ng-jhipster-angular13-compatibility`, exclusivamente para probar y decidir el bloqueante `ng-jhipster`/View Engine y el linker fuera del repositorio. Solo si se resuelve o se demuestra compatible, 8F1 podrá ejecutar Angular 13 + Node 14.21.3 + TypeScript 4.6.4 + ng-bootstrap 11.0.1, manteniendo RxJS 6, Webpack 5.30.0, webpack-cli 4.10.0 y webpack-dev-server 4.15.2.

## Gates propuestos para 8F1

- **A13-A**: `npm ci` reproducible con Node 14.21.3/npm 6.14.18 y lockfile v1.
- **A13-B**: F-B permanece diferido.
- **A13-BT**: ngc/Angular/TypeScript/linker sin errores.
- **A13-C**: 60 suites/181 tests verdes.
- **A13-D**: build productivo reproducible.
- **A13-E**: smoke del artefacto estático.
- **A13-DEV**: pipeline hasta el límite F-B, sin corregir lint.
- **A13-DIFF**: sin disables, ignores, `any` oportunista, tests omitidos ni cambios backend/CI.
- **F-F**: no bloqueante; no mezclar Protractor.

## Próximo paso

No iniciar Angular 13 todavía. El siguiente trabajo propuesto es `modernization/08f0a-ng-jhipster-angular13-compatibility`: prueba temporal y documentada del empaquetado de `ng-jhipster` y de la necesidad real del linker, sin migrar dependencias ni tocar el repositorio productivo.
