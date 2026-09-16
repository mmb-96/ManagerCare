# Etapa 8C: Angular 9 a Angular 10

## Alcance

Esta etapa migra exclusivamente el frontend de Angular 9.0.4 a Angular 10.2.x.
Se conserva el runtime portátil Node 12.16.1 con npm 6.14.2, el build
Webpack/JHipster personalizado, NgModules, Protractor, TSLint, Moment y el
contrato con el backend. No se ejecutó `ng update`, porque este árbol no usa el
builder estándar de Angular CLI.

## Versiones

| Área | Antes | Después | Motivo |
|---|---:|---:|---|
| Angular common/compiler/core/forms/localize/platform-browser/platform-browser-dynamic/router | 9.0.4 | 10.2.5 | Framework Angular 10.2 final alineado |
| Angular compiler-cli | 9.0.4 | 10.2.5 | Debe coincidir con compiler |
| Angular CLI / @ngtools/webpack | 9.0.4 | 10.2.4 | Última versión 10.2 disponible; mantiene el build Webpack custom |
| TypeScript | 3.7.5 | 3.9.10 | Rango requerido por Angular 10 (`>=3.9 <4.1`) |
| RxJS | 6.5.3 | 6.5.5 | Sigue en 6.5.x; peer mínimo de ng-bootstrap 7 |
| Zone.js | 0.10.2 | 0.10.3 | Peer de Angular 10 |
| tslib | 1.10.0 | 2.0.3 | Dependencia de Angular 10 |
| ng-bootstrap | 6.0.0 | 7.0.0 | La 6 declara peers Angular 9; la 7 declara Angular 10 |
| @angular/animations | ausente | ausente | No era dependencia directa ni se añadió |
| Webpack / Webpack Dev Server | 4.41.2 / 3.9.0 | sin cambios | Fuera de alcance |
| ng-jhipster / ngx-webstorage | 0.12.0 / 5.0.0 | sin cambios | Compatibilidad validada por build y tests |
| Protractor / WebDriver Manager | 5.4.2 / 12.1.7 | sin cambios | Deuda E2E separada |

## Cambios de código

No se modificó TypeScript ni HTML. No hay usos de `ModuleWithProviders` que
requieran un genérico. Los `entryComponents` históricos siguen presentes y
compilan bajo Angular 10; no se eliminan en esta etapa.

## Lockfile

`package-lock.json` se regeneró con npm 6.14.2 y conserva
`lockfileVersion: 1`. El cambio comprende 1.037 inserciones y 314 eliminaciones
en el grafo: Angular 10, Angular DevKit/Schematics/CLI, sus transitivas y los
peers estrictamente requeridos. Hubo 48 cambios de versión en dependencias de
primer nivel del lockfile; no se introdujo un upgrade independiente de Webpack,
Protractor, JHipster, Moment o RxJS 7.

## Gates

| Gate | Resultado |
|---|---|
| F-A Install | ✅ `npm ci` con Node 12/npm 6: 275.84 s; repetición desde `node_modules` eliminado: 144.44 s; lockfile estable |
| F-B Lint | ✅ 0 errores, 0 warnings; 105.86 s |
| F-C Unit | ✅ 60 suites, 181 tests; 0 fallos; 335.92 s |
| F-D Production build | ✅ 69 archivos en `target/classes/static`; 235.44 s; repetición limpia ✅, 69 archivos, 118.41 s |
| F-E Contract/smoke | ✅ contrato estático preservado; Webpack Dev Server y BrowserSync compilaron y sirvieron `/` con HTTP 200 en 9060 y 9000 sin backend |
| F-F E2E legacy | ⚠️ no ejecutado: ChromeDriver 114.0.5735.16 sigue siendo incompatible con Chrome 153.0.8010.37 |

El smoke no inició backend: los rechazos de proxy de `/api/account` hacia el
puerto 8080 eran esperados. Los procesos Node temporales y los listeners 9000
y 9060 se detuvieron al terminar.

## Contrato backend

No se cambiaron `/api/authenticate`, `/api/account`, JWT, `Authorization:
Bearer`, paginación (`X-Total-Count` y `Link`), cabeceras de alerta
`X-managerCareApp-alert` y `X-managerCareApp-params`, Problem+JSON ni el manejo
de 401/403. El cliente conserva los interceptores y servicios históricos.

## Vulnerabilidades

La API de Dependabot se consultó en modo lectura. Sigue reportando para la rama
por defecto, que aún no contiene esta etapa, 237 alertas: 20 critical, 114
high, 81 medium y 22 low. Por ello no puede atribuirse una reducción o aumento
al lockfile local de Angular 10 sin publicar la rama; no se aplicaron fixes de
seguridad adicionales. Las alertas directas de Angular que muestra GitHub
siguen siendo las de `master`, no una evaluación de esta rama.

## Warnings

- `fsevents` opcional intenta compilar con node-gyp en Windows sin el workload
  C++ de Visual Studio; npm termina correctamente.
- npm informa dependencias legacy/deprecadas transitivas del CLI Angular 10.
- `ts-jest` conserva su recomendación de configuración y Babel desoptimiza el
  formato de bundles UMD grandes durante los tests.
- `caniuse-lite` está desactualizado.
- Webpack mantiene sus avisos de tamaño: bundle principal de 968 KiB y
  entrypoint principal de 1.08 MiB, además de Swagger UI.

No se corrigieron porque no pertenecen al salto mínimo 9→10.

## Deuda y recomendación 8D

1. P1: Protractor/WebDriver no puede ejecutarse con Chrome 153 y ChromeDriver
   114; requiere una etapa aislada de tooling/E2E.
2. P2: continuar Angular 10→11 de forma major-by-major tras revisar sus peers
   y migraciones aplicables al build custom.
3. P2: Webpack, TSLint, JHipster frontend, Moment, Browserslist y tamaño de
   bundles siguen fuera de alcance.

La recomendación para 8D es Angular 10→11 manteniendo Node 12 inicialmente,
sin combinarlo con Webpack 5, RxJS 7, sustitución de Protractor ni eliminación
de JHipster.
