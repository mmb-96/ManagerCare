# Etapa 8A: evaluación del frontend Angular

## Alcance y método

Este documento es un inventario estático del árbol que parte de `master` en
`a7cfe4556fbca74f83f3fe19b8e42df53e70059c`. No se ejecutaron `npm install`,
`npm ci`, builds, tests ni actualizaciones; tampoco se regeneró el lockfile.
La única salida de esta etapa es este diagnóstico.

El contrato backend se considera congelado: JWT Bearer, `/api/authenticate`,
`/api/account`, rutas REST, cabeceras de paginación y alerta, Problem+JSON y
los estados 401/403/404/405 no son vías de simplificación de la migración.

## Stack frontend actual

| Paquete | Versión | Directa/transitiva | Ámbito | Uso real | Riesgo |
|---|---:|---|---|---|---|
| Angular core, common, compiler, forms, router y platform-* | 9.0.4 | Directa | Runtime | Aplicación completa | Muy alto; fuera de soporte |
| `@angular/localize` / CLI / compiler-cli / ngtools | 9.0.4 | Directa | Build | Compilación Angular dentro de Webpack | Muy alto |
| Angular DevKit core/schematics | 9.0.4 | Transitiva del CLI | Build | `angular.json` existe, pero no define builders | Alto |
| TypeScript | 3.7.5 | Directa | Build | Todo el código TypeScript | Muy alto |
| RxJS | 6.5.3 | Directa | Runtime | HTTP, estado y operadores pipeable | Alto |
| Zone.js | 0.10.2 | Directa | Runtime | Runtime Angular | Alto |
| tslib | 1.10.0 | Directa | Runtime | Helpers TS | Medio |
| Bootstrap / ng-bootstrap | 4.4.1 / 6.0.0 | Directa | UI | Estilos y componentes | Alto |
| Font Awesome Angular/core/icons | 0.6.0 / 1.2.26 / 5.12.0 | Directa | UI | Iconos registrados en CoreModule | Medio |
| Moment | 2.24.0 | Directa | Runtime | Fechas de dominio y datepicker | Alto |
| `ng-jhipster` / `ngx-webstorage` | 0.12.0 / 5.0.0 | Directa | Runtime | Auth, alertas, i18n, eventos y almacenamiento | Muy alto |
| `@ngx-translate/*` | 11.0.1 / 4.0.0 | Directa | Runtime | Único idioma `es` | Medio |
| Webpack / CLI / dev-server | 4.41.2 / 3.3.10 / 3.9.0 | Directa | Build/desarrollo | Build real y proxy local | Muy alto |
| Jasmine/Jest preset | Jest 24.9.0, `jest-preset-angular` 8.0.0 | Directa | Unit tests | 60 specs | Alto |
| Protractor / Webdriver | 5.4.2 / 12.1.7 | Directa | E2E | 9 specs contra backend | Muy alto; Protractor discontinuado |
| TSLint / Codelyzer / ESLint | 6.0.0 / 5.2.0 / 6.7.2 | Directa | Lint | `npm run lint` ejecuta ESLint; `tslint.json` persiste | Alto |
| BrowserSync | 2.26.7 | Directa | Desarrollo | Proxy `9000 -> 9060 -> 8080` | Alto |
| Husky / lint-staged / Prettier | 3.1.0 / 8.2.1 / 1.19.1 | Directa | Tooling | Hooks y formato | Medio |

Los ocho paquetes Angular solicitados (`animations` no figura como dependencia
directa, mientras common/compiler/core/forms/platform-browser/platform-browser-dynamic/router sí) están alineados en `9.0.4` allí donde se declaran. No hay evidencia de una mezcla de minors Angular. `@angular/animations` deberá verificarse antes del primer salto porque no aparece en `package.json`.

El lockfile es npm v1, contiene 1.356 entradas, frente a 24 dependencias de
runtime y 69 de desarrollo declaradas. Es coherente con npm 6.14.2, la versión
fijada por Maven. No se ha probado su instalación con Node moderno.

## Arquitectura frontend

La aplicación es íntegramente NgModule-based: `ManagerCareAppModule` compone
Core, Shared, Home, Entities y el routing raíz. Hay 25 módulos, 59 componentes,
27 servicios, 2 directivas, 1 pipe, 1 guard de acceso y 4 interceptores HTTP.
Las zonas principales son `account`, `admin`, `entities`, `core`, `shared`,
`layouts`, `home` y `blocks`.

FormsModule y ReactiveFormsModule se exportan desde SharedLibs. Se usan
`FormBuilder` y validadores; no se detectaron `UntypedForm*`, `FormGroup`,
`FormControl` ni `ngModel` como usos directos. Esto reduce el trabajo de forms
tipados, pero no lo elimina: el código actual usa APIs de Angular 9 y deberá
revalidarse durante cada salto.

El routing usa `RouterModule`, guard `UserRouteAccessService`, datos de
autoridades y lazy loading dinámico moderno (`import(...).then(...)`), no la
sintaxis histórica `module#ModuleName`. Admin, Account y nueve entidades se
cargan de forma diferida. No hay resolvers ni preloading configurados. Todos
los componentes permanecen candidatos a standalone solo después de estabilizar
Angular; no se introducirá standalone durante los saltos iniciales.

## JHipster coupling

| Componente JHipster | Uso observado | Acoplamiento | Estrategia futura |
|---|---|---|---|
| `NgJhipsterModule` | Core y SharedLibs | Alto | Mantener hasta que Angular y contratos estén estabilizados |
| `JhiEventManager` | listas, diálogos, errores | Alto | Adaptador/reemplazo posterior, no durante majors |
| `JhiAlertService` | alertas y `NotificationInterceptor` | Contractual | Conservar hasta verificar `X-managerCareApp-*` |
| `JhiConfigService`/`JhiLanguageService` | traducción e idioma | Alto | Mantener; migrar i18n separadamente |
| `translatePartialLoader` y missing handler | `@ngx-translate` | Alto | Mantener al inicio |
| `ngx-webstorage` | token JWT y preferencias | Contractual de sesión | Mantener hasta una etapa de auth dedicada |
| Entity modules/rutas generadas | nueve entidades y CRUD | Alto | Conservar mientras se actualiza Angular |
| needles de generator-jhipster | módulos, assets e i18n | Alto | Congelar generación; retirar después de modernizar |

No se propone eliminar JHipster simultáneamente con Angular. El acoplamiento a
auth, alertas, i18n, eventos y entidades haría imposible atribuir regresiones.

## Autenticación, errores y paginación

`AuthServerProvider` hace POST a `/api/authenticate`, recibe `id_token` y lo
guarda como `authenticationToken` en localStorage o sessionStorage mediante
`ngx-webstorage`. `AuthInterceptor` añade `Authorization: Bearer`; AccountService
lee `/api/account`; UserRouteAccessService aplica authorities y AuthExpiredInterceptor
abre el login tras un 401. El flujo de logout borra solo ese token.

HTTP usa exclusivamente `HttpClient`/`HttpClientModule`; no existe
`@angular/http`. Hay cuatro interceptores: auth, expiración, error y
notificación. ErrorHandler emite el `HttpErrorResponse` por JhiEventManager;
las alertas leen dinámicamente cabeceras terminadas en `app-alert` y `app-params`,
por lo que dependen de `X-managerCareApp-alert` y `X-managerCareApp-params`.
No se detectó un parser explícito de `application/problem+json`; el consumidor
recibe el error HTTP completo, incluyendo `status`, `message` y `error`.

User management, audits y user-teams consumen `X-Total-Count` y usan
`ngb-pagination`. No se detectó `parseLinks` ni consumo de la cabecera `Link`;
aun así, ambas cabeceras forman parte del contrato congelado y deben incluirse
en el smoke futuro.

Existe una deuda funcional previa: `ObjetivoUserService` sigue llamando a
`/api/objetivos-user` y `/api/objetivos-user-next`, rutas que no tienen mapping
backend histórico verificable. No se restauran ni cambian en la migración
Angular: requieren una decisión de contrato separada.

## RxJS, Moment y temporalidad

RxJS 6.5.3 se usa con imports `rxjs` y `rxjs/operators`, `Observable`,
`ReplaySubject`, `of`, `map`, `tap`, `catchError` y `shareReplay`. No se detectaron
`toPromise`, `resultSelector`, `multicast`, `forkJoin` ni `throwError` legacy.
La recomendación es mantener RxJS 6 durante 9→12 y modernizar cualquier API
deprecada encontrada antes del salto a RxJS 7, que Angular moderno acepta.

Moment aparece en 19 referencias de código: adaptación del datepicker
ng-bootstrap, configuración Core y modelos/servicios de Puntos y Objetivos
conseguidos. Hace parsing, formato y fechas de formulario; no se observó uso de
timezone. Por su uso de dominio y por dos alertas High, la opción menos arriesgada
es mantenerlo mientras se estabiliza Angular y planificar un reemplazo dedicado
posterior, no un override transitorio ni una sustitución durante el primer salto.

## Build, output y Node/npm

El build real no es Angular CLI: `angular.json` no declara builders. Los scripts
npm invocan Webpack 4 y `@ngtools/webpack`; dev-server sirve en 9060 con proxy
a 8080 y BrowserSync expone 9000. El build de producción escribe bundles y CSS
en `target/classes/static`, que Spring Boot empaqueta. Webpack copia Swagger UI,
assets e i18n, genera Service Worker Workbox y conserva solamente locale `es`
de Moment.

```
desarrollador / Maven profile webpack
  -> npm run webpack:dev | webpack:prod
  -> Webpack 4 + AngularCompilerPlugin
  -> target/classes/static
  -> recursos estáticos Spring Boot
```

Maven fija Node 12.16.1 y npm 6.14.2 a través de frontend-maven-plugin 1.9.1,
y ejecuta `npm install`, no `npm ci`, en perfiles webpack/dev/prod. `package.json`
solo declara Node `>=8.9.0`, demasiado amplio para una ejecución reproducible.
La CI backend actual no instala ni prueba el frontend.

## Testing y lint

Hay 60 specs unitarios Jest/Jasmine-style bajo `src/test/javascript/spec` y
9 specs E2E Protractor/Mocha. Protractor hace `directConnect` a Chrome y apunta
a `http://localhost:8080`, por lo que necesita backend real y datos/servicios
preparados. El postinstall descarga WebDriver, otro motivo para no ejecutarlo
durante el diagnóstico.

`npm test` ejecuta primero ESLint y luego Jest con cobertura; `npm run lint`
usa ESLint. No hay script TSLint, aunque `tslint.json` y Codelyzer continúan en
el repositorio. ESLint 6 convive con `@typescript-eslint` 2 y un loader Webpack
obsoleto. La migración TSLint/Codelyzer→ESLint debe ser una etapa propia después
de estabilizar los primeros majors Angular, para no mezclar reglas con cambios
de compilador.

## Vulnerabilidades npm

Dependabot registra 237 alertas en `package-lock.json`: 20 Critical, 114 High,
81 Medium y 22 Low; Maven tiene cero. El inventario offline de Dependabot de la
etapa 7B contiene las tres páginas, con el paquete, severidad, scope, manifest,
rango vulnerable y primera versión corregida de cada alerta. Se cruzó en modo
lectura con las versiones y padres de `package-lock.json`.

Cada alerta C/H se asigna una sola vez al árbol principal que la introduce. Si
un paquete aparece en más de un árbol hoisted, prevalece el uso principal de
este repositorio: runtime, Webpack, Protractor, tooling o JHipster. Por ello el
recuento es reconciliable y no duplica paquetes por cada padre alternativo.

| Categoría | Alertas Critical | Alertas High | Total C/H | Paquetes únicos |
|---|---:|---:|---:|---:|
| A. Angular runtime directo | 0 | 15 | 15 | 4 |
| B. Runtime transitivo | 1 | 14 | 15 | 7 |
| C. Angular CLI / Webpack / build | 1 | 36 | 37 | 12 |
| D. Testing / Protractor / WebDriver | 7 | 12 | 19 | 10 |
| E. Lint / developer tooling | 2 | 16 | 18 | 11 |
| F. JHipster / tooling legacy | 9 | 21 | 30 | 17 |
| **Total reconciliado** | **20** | **114** | **134** | **61** |

| Categoría | Paquetes principales | Padre/toolchain que los introduce |
|---|---|---|
| A | `@angular/common`, `@angular/core`, `@angular/compiler`, `moment` | Dependencias runtime directas |
| B | `@babel/traverse`, `ansi-regex`, `brace-expansion`, `cross-spawn`, `json5`, `minimatch`, `semver` | Árbol runtime/transitivo hoisted; no hay dependencia directa segura que lo sustituya aislada |
| C | `tar`, `axios`, `node-forge`, `immutable`, `js-yaml`, `postcss`, `loader-utils`, `webpack-dev-middleware` | Webpack 4, CLI, loaders, plugins y dev-server |
| D | `node-forge`, `form-data`, `elliptic`, `pbkdf2`, `adm-zip`, `aws-sdk`, `json-schema` | Protractor, webdriver-manager, Selenium y sus utilidades de red/criptografía |
| E | `simple-git`, `object-path`, `lodash.template`, `async`, `shelljs`, `tmp`, `property-expr` | hooks, lint, utilidades de desarrollo y scripts |
| F | `ejs`, `lodash`, `socket.io-parser`, `xmlhttprequest-ssl`, `ws`, `y18n`, `qs` | generator-JHipster y BrowserSync/SockJS/engine.io generados para desarrollo |

La única aparente repetición entre las filas descriptivas (por ejemplo
`node-forge` o paquetes socket) se refiere a relaciones de dependencia
alternativas observables en el lockfile; la tabla numérica los asigna una sola
vez a su árbol dominante. Padres estáticos relevantes: `@babel/traverse`
proviene de Babel/Jest; `ejs` de generator-jhipster y webpack-bundle-analyzer;
`loader-utils` de los loaders Webpack; `pbkdf2` de crypto-browserify;
simple-git de `g-status`; y la cadena socket/websocket de BrowserSync/SockJS/
engine.io. La estrategia sigue siendo actualizar los padres por major, no
aplicar miles de overrides transitorios.

## Bloqueantes y riesgos priorizados

1. Angular 9, TypeScript 3.7, Webpack 4 y Node 12 están fuera de soporte y sus
   peer dependencies impiden un salto seguro conjunto.
2. El build está acoplado a Webpack personalizado/JHipster, no al builder CLI;
   cada major debe validar producción y proxy.
3. Las alertas C/H incluyen Angular y Moment de runtime, además de tooling;
   no son corregibles de forma sostenible con overrides masivos.
4. Protractor/WebDriver y BrowserSync amplían el árbol vulnerable y requieren
   entorno real; no deben bloquear el baseline unitario.
5. Auth, alertas y paginación dependen de contratos backend explícitos.
6. Las dos rutas de objetivos-user son deuda frontend/backend previa e
   independiente de Angular.

## Estrategia Angular, Node, TypeScript y RxJS

La recomendación es avanzar major a major mediante `ng update` controlado en
ramas pequeñas, manteniendo NgModules, JHipster, Moment, Karma/Jest actual y
el build Webpack hasta que se conozca una alternativa validada. No hay base
técnica para un salto directo 9→22.

| Salto | Cambios esperados | Riesgo | Validaciones obligatorias |
|---|---|---|---|
| 9→10 | CLI/TS 3.9, Ivy y dependencias pares | Medio | F-A a F-D |
| 10→11 | CLI, TS 4.0 y Webpack integration | Medio | F-A a F-D |
| 11→12 | Node 12.14+, TS 4.2, Webpack 5 en tooling | Alto | F-A a F-E |
| 12→13 | fin View Engine, TS 4.4, RxJS compatible | Alto | F-A a F-E |
| 13→14 | CLI, TS 4.6, dependencias UI | Alto | F-A a F-E |
| 14→15 | TS 4.8 y librerías de UI | Medio | F-A a F-E |
| 15→16 | Node 16+, TS 4.9, preparar RxJS 7 | Medio | F-A a F-E |
| 16→17 | Node 18+, TS 5.2, builder/tooling | Alto | F-A a F-E |
| 17→20 | majors uno a uno, Node/TS coordinados | Alto | F-A a F-F selectivo |
| 20→22 | solo tras revalidar ecosistema | Medio | F-A a F-F |

La matriz oficial de Angular indica: 9.0 requiere Node 10.13/12.11 y TS
3.6–3.7; 10 requiere Node 10.13/12.11 y TS 3.9–4.0; 11 requiere TS 4.0–4.1;
12 Node 12.14/14.15 y TS 4.2–4.3; 13 Node 12.20/14.15/16.10 y TS 4.4–4.6;
14 Node 14.15/16.10 y TS 4.6–4.8; 15 Node 14.20/16.13/18.10 y TS 4.8;
16 Node 16.14/18.10 y TS 4.9–5.1; 17 Node 18.13/20.9 y TS 5.2–5.4;
20 Node 20.19/22.12/24 y TS 5.8; 21 Node 20.19/22.12/24 y TS 5.9;
22 Node 22.22/24.15/26 y TS 6.0. RxJS 6.5.3 permanece admitido desde Angular
9 hasta los majors modernos, aunque RxJS 7.4+ también lo está.

Objetivo intermedio: Angular 17.3 con Node 20.9 y TypeScript 5.2–5.4, tras
tener build y contratos estables. Objetivo final razonable: Angular 22 con
Node 24.15+ y TypeScript 6.0, solo cuando ng-bootstrap, ng-jhipster/alternativa,
Webpack/builder y tests estén preparados. Es una recomendación de planificación,
no una versión fijada para la siguiente etapa.

## Testing, lint y JHipster futuros

En la transición conservar inicialmente Jest y la cobertura existente. Protractor
no debe ser actualizado: se recomienda Playwright en una etapa posterior porque
permite aislar navegadores y contratos E2E modernos; Cypress es una alternativa
válida, pero Playwright encaja mejor con una suite de smoke independiente del
backend local. La sustitución no se mezcla con Angular 9→10.

La migración TSLint/Codelyzer→ESLint debe ocurrir después de alcanzar al menos
Angular 13 y estabilizar TypeScript. JHipster debe sobrevivir las actualizaciones
iniciales; al final se separarán, en etapas distintas, auth/storage, alertas,
i18n/eventos y las utilidades de entidades.

## Etapas propuestas y gates frontend

1. **8B — baseline frontend reproducible (sin upgrades):** identificar un
   Node/npm histórico aislado para Angular 9, ejecutar `npm ci` sin alterar el
   lockfile, lint, unit y build prod; valorar E2E y documentar todo fallo
   histórico antes de cualquier actualización.
2. **8C — Angular 9→10:** dependencia/CLI/TS coordinadas y F-A…F-E.
3. **8D — 10→11→12:** un major por rama; resolver el cambio de tooling Webpack.
4. **8E — 12→15:** mantener NgModules/JHipster y validar contratos tras cada salto.
5. **8F — 15→17:** Node 20, TS 5 y preparación RxJS 7.
6. **8G — 17→objetivo moderno:** majors individuales hasta el objetivo acordado.
7. **8H — tooling:** ESLint, Webpack/builder y BrowserSync.
8. **8I — E2E:** retirar Protractor/WebDriver y adoptar Playwright.
9. **8J — reducción JHipster/Moment:** solo con contratos y pruebas de reemplazo.

| Gate | Definición | Obligatorio |
|---|---|---|
| F-A | instalación reproducible con lockfile | Todos los saltos |
| F-B | lint | Desde 8B |
| F-C | unit tests con cobertura | Todos los saltos |
| F-D | build producción y assets Spring Boot | Todos los saltos |
| F-E | smoke de contrato backend/frontend: JWT, account, alertas, paginación y Problem | Desde 9→10 |
| F-F | E2E aislado | Tras reemplazar Protractor; opcional hasta entonces |

La CI frontend futura necesitará Node fijado por tramo, `npm ci`, F-B, F-C y
F-D. F-E debe usar backend efímero sintético y F-F permanecer separado hasta
que exista el sustituto de Protractor.
