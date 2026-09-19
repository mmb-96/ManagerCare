# Etapa 8F0a — compatibilidad de ng-jhipster con Angular 13

## Objective

Resolver el P0 identificado en 8F0 mediante un prototipo externo y reproducible: comprobar si `ng-jhipster` 0.12.0 puede participar en una compilación Angular 13 y determinar qué necesita el Webpack custom de ManagerCare. Esta etapa no modifica dependencias, código, Webpack ni configuración versionada de ManagerCare.

## ManagerCare ng-jhipster usage

| Símbolo ng-jhipster | Archivo(s) ManagerCare | Runtime/compile | Criticidad |
| --- | --- | --- | --- |
| `JhiEventManager` | Componentes de administración y entidades, diálogos de borrado e interceptor de errores | Runtime | Alta: eventos de actualización y errores HTTP |
| `JhiAlertService`, `JhiAlert`, `JhiEventWithContent` | `shared/alert/*` e interceptor de notificaciones | Runtime | Alta: alertas de aplicación |
| `JhiLanguageService` | `core.module`, navbar, registro, ajustes y autenticación | Runtime | Alta: idioma e inicialización |
| `JhiConfigService`, `translatePartialLoader`, `missingTranslationHandler` | `core/core.module.ts` | Runtime | Alta: configuración y traducciones |
| `NgJhipsterModule` | `core/core.module.ts`, `shared/shared-libs.module.ts` | Runtime/compile | Alta: módulo raíz y compartido |
| `JhiResolvePagingParams` | Rutas de auditoría y gestión de usuarios | Runtime | Media: paginación de administración |
| `JhiDateUtils`, `JhiDataUtils`, `JhiParseLinks` | Specs y módulo de prueba | Compile/test | Media: cobertura unitaria |
| `JhiAlertComponent`, `JhiAlertErrorComponent`, `JhiItemCountComponent`, `JhiPaginationUtil` | Sin import directo encontrado | — | No se atribuye uso productivo |

La aplicación mantiene sus propios componentes de alerta bajo `app/shared/alert`; no se asumió que coincidieran con componentes exportados por el paquete.

## ng-jhipster packaging

El `package.json` publicado de `ng-jhipster` 0.12.0 contiene:

| Campo | Evidencia |
| --- | --- |
| `main` | `bundles/ng-jhipster.umd.js` |
| `module` | `fesm5/ng-jhipster.js` |
| `es2015` / `fesm2015` | `fesm2015/ng-jhipster.js` |
| `typings` | `ng-jhipster.d.ts` |
| `metadata` | `ng-jhipster.metadata.json` |
| Declaraciones partial-Ivy publicadas | No |

La presencia de FESM5/FESM2015 y de `metadata.json`, junto con la salida explícita de `ngcc` («Processing legacy View Engine libraries»), clasifica el paquete como **A — librería View Engine**. No es una librería partial-Ivy ni full-Ivy publicada.

No declara `dependencies` ni `optionalDependencies`; su grafo contractual está en `peerDependencies`:

| Dependencia/peer | Rango declarado | Stack Angular 13 candidato | Compatible declarado |
| --- | --- | --- | --- |
| `@angular/core`, `common`, `forms`, `router` | `^9.0.0` | `13.3.12` | No |
| `rxjs` | `^6.5.2` | `6.5.5` | Sí |
| `tslib` | `^1.10.0` | `2.x` | No |
| `@ngx-translate/core` | `^11.0.1` | `11.0.1` | Sí |
| `@ngx-translate/http-loader` | `^4.0.0` | `4.0.0` | Sí |
| `@ng-bootstrap/ng-bootstrap` | `^5.1.0` | `11.0.1` | No |
| `@fortawesome/angular-fontawesome` | `^0.5.0` | `0.6.0` | Sí |
| Font Awesome core / solid | `^1.2.21` / `^5.10.1` | `1.2.26` / `5.12.0` | Sí |

Los peers antiguos son una incompatibilidad **declarativa**. Por sí solos no demostraban una incompatibilidad técnica.

## Angular 12/ngcc behavior

La baseline Angular 12 ya requería ejecutar `ngcc` local tras instalar dependencias. La evidencia de las etapas 8D-v2 y 8E1 registra que `ngcc` procesó las librerías legacy y permitió las compilaciones Angular 12/Webpack 5. No se trató como solución permanente para partial-Ivy; era la conversión de bibliotecas View Engine que el grafo histórico aún necesita.

## Angular 13 experiment

El workspace temporal, fuera de ManagerCare, usó:

| Componente | Versión |
| --- | --- |
| Node / npm | `14.21.3` / `6.14.18` |
| Angular | `13.3.12` |
| CLI / `@ngtools/webpack` | `13.3.11` |
| TypeScript | `4.6.4` |
| RxJS / Zone.js | `6.5.5` / `0.11.4` |
| Webpack / webpack-cli | `5.30.0` / `4.10.0` |
| ng-bootstrap | `11.0.1` |
| ng-jhipster | `0.12.0` |

`npm` 6 terminó correctamente, aunque emitió los warnings de peer Angular 9, `tslib` 1 y ng-bootstrap 5. No se usaron `--force`, overrides ni resoluciones. Esto demuestra una instalación permisiva de npm 6, no compatibilidad por sí mismo.

La aplicación mínima importó `NgJhipsterModule.forRoot`, `JhiEventManager`, `JhiLanguageService`, `JhiConfigService`, traducciones, `NgbModule`, `CookieModule`, `NgxWebstorageModule`, `InfiniteScrollModule` y `FontAwesomeModule`: cubre los módulos compartidos y de core que usa ManagerCare.

## Compilation without linker

La matriz obtenida fue:

| Prueba | Resultado | Evidencia |
| --- | --- | --- |
| `ngc` Angular 13 antes de `ngcc` | Bloqueada | `ng-jhipster` y `@ngx-translate/core` publican `ModuleWithProviders` sin parámetro genérico; TypeScript 4.6 lo rechaza |
| `ngcc` Angular 13 sobre `ng-jhipster` y peers | Verde | Procesó explícitamente `ng-jhipster` como View Engine y generó `main_ivy_ngcc` / `__ivy_ngcc__` |
| `ngc` Angular 13 después de `ngcc`, sin linker | Verde | El módulo real de compatibilidad compila |
| Webpack custom mínimo sin regla `.mjs` | Bloqueada | Resolución fully-specified de Webpack 5 no resuelve `rxjs/operators` desde FESM `.mjs` |
| Webpack con regla `.mjs`, sin linker | Compila, pero smoke runtime bloqueado | Las declaraciones partial-Ivy quedan sin enlazar y fuerzan fallback JIT sin compilador |

Por tanto, el linker no soluciona `ng-jhipster`: para ese paquete la pieza necesaria es `ngcc`. El linker corresponde a otro formato de librería.

## Partial-Ivy inventory

| Librería | Formato observado | Linker requerido con Webpack custom |
| --- | --- | --- |
| `@angular/*` 13.3.12 | APF `.mjs` con `ɵɵngDeclare*` | Sí |
| `@ng-bootstrap/ng-bootstrap` 11.0.1 | APF `.mjs` partial-Ivy con `ɵɵngDeclare*` | Sí |
| `ng-jhipster` 0.12.0 | View Engine, FESM5/FESM2015 y metadata | No; requiere `ngcc` |
| `@ngx-translate/core` 11.0.1 | View Engine | No; requiere `ngcc` |
| `@ngx-translate/http-loader` 4.0.0 | View Engine | No; requiere `ngcc` |
| `ngx-webstorage` 5.0.0 | View Engine | No; requiere `ngcc` |
| `ngx-cookie` 4.0.2 | View Engine | No; requiere `ngcc` |
| `ngx-infinite-scroll` 8.0.1 | View Engine | No; requiere `ngcc` |
| `@fortawesome/angular-fontawesome` 0.6.0 | View Engine | No; requiere `ngcc` |

## Linker experiment

La prueba temporal añadió exclusivamente `@babel/core` 7.18.13, `babel-loader` 8.2.5 y `@angular/compiler-cli/linker/babel`. La regla se limitó a `node_modules/@angular` y `node_modules/@ng-bootstrap`; no procesó globalmente `node_modules`.

La regla conceptual futura debe mantener dos responsabilidades separadas:

1. resolver `.mjs` con `resolve.fullySpecified: false`;
2. aplicar el linker Babel únicamente a los paquetes partial-Ivy identificados.

Con esa regla selectiva, el build Webpack fue verde y el bundle se ejecutó en Node. El smoke creó un `Injector`, obtuvo un `JhiEventManager`, publicó un evento y el suscriptor lo recibió. No es una prueba funcional de navegador, pero sí descarta un error inmediato de metadata, carga o DI para el símbolo productivo más crítico.

## ng-jhipster result

Clasificación: **A — Compatible de facto**, con límites explícitos.

`ng-jhipster` 0.12.0 instaló con warnings de peers, fue convertido por `ngcc`, compiló mediante `ngc` y Webpack, y `JhiEventManager` superó el smoke de DI. La conclusión no convierte sus peers obsoletos en compatibles declarados ni sustituye una validación completa de ManagerCare.

## Angular linker decision

Clasificación: **L2 — necesario con configuración simple y selectiva**.

`@ngtools/webpack` 13 inició automáticamente `ngcc` para View Engine, pero no enlazó las declaraciones partial-Ivy del bundle custom. El enlace Babel selectivo para `@angular/*` y `@ng-bootstrap/*`, más la compatibilidad `.mjs`, eliminó el fallo runtime. No corresponde añadir linker para `ng-jhipster` ni aplicarlo a todo `node_modules`.

## Webpack custom impact

El Webpack actual solo resuelve `['.ts', '.js']`. Angular 13 introduce entry points `.mjs`; la futura etapa deberá evaluar:

| Área | Impacto futuro mínimo aparente |
| --- | --- |
| `resolve.extensions` | Incluir `.mjs` |
| Regla JavaScript | `resolve.fullySpecified: false` para `.m?js` |
| Linker | Regla Babel selectiva para partial-Ivy, antes de loaders JavaScript amplios y separada del loader TypeScript `@ngtools/webpack` |
| Source maps / caché | Validarlas en el build real; el prototipo usó `cacheDirectory: false` y `compact: false` para observabilidad |

## P0 status

**Resuelto para la decisión de compatibilidad.** `ng-jhipster` no bloquea por sí solo el paso a Angular 13 si se conserva `ngcc` para el grafo View Engine. La deuda permanece: los peers Angular 9 y varias bibliotecas legacy siguen sin soporte declarado y requieren una validación completa antes de integrar versiones en ManagerCare.

## Risks

- El prototipo no ejecutó toda la aplicación, sus tests unitarios, build productivo ni E2E.
- La conversión `ngcc` mantiene dependencia de bibliotecas View Engine; futuras versiones de Angular pueden retirar esa vía.
- La compatibilidad declarada de `ng-jhipster` continúa anclada a Angular 9.
- Las advertencias de tamaño del bundle del prototipo no son una métrica de producción.

## Next step

La siguiente etapa propuesta es **8F1 — Angular 13 version migration**: actualizar de forma coordinada las versiones aprobadas, incorporar solo la configuración Webpack demostrada aquí y ejecutar los gates frontend. No se recomienda 8F0b mientras la evidencia de 8F0a permanezca vigente.

Referencias: [Angular version compatibility](https://angular.dev/reference/versions) y [Angular libraries / linker](https://angular.dev/tools/libraries/creating-libraries).
