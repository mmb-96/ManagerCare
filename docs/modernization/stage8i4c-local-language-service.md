# Etapa 8I4C — servicio local de idioma

## Alcance y base

Base: `42ccd454306e8dc0636c14ede98755e6f194d372` (`decouple ng-jhipster config`).
Rama: `modernization/08i4c-local-language-service`.

Se sustituye exclusivamente `JhiLanguageService` de `ng-jhipster 0.12.0`
por una implementación local compatible. Los cambios productivos de los cinco
consumidores se limitan a imports. No cambian templates, traducciones,
dependencias, backend, CI ni contratos REST.

## Contrato e implementación local

Archivo: `src/main/webapp/app/shared/jhipster-compat/language.service.ts`.
Provider: `@Injectable({ providedIn: 'root' })`, con instancia compartida.
Dependencias: `TranslateService` y `JhiConfigService` local de 8I4B.

La implementación inspeccionada de `ng-jhipster` conserva inicialmente
`currentLang = 'en'` en memoria. Durante el bootstrap, `init(): void` lee
`defaultI18nLang` de la configuración local (`es`), actualiza `currentLang`,
llama a `TranslateService.setDefaultLang(...)` y después a `use(...)`.

`changeLanguage(languageKey: string): void` actualiza `currentLang`, muta
`configService.getConfig().defaultI18nLang` y llama a `TranslateService.use(...)`.
`getCurrentLanguage(): string` devuelve el idioma actual en memoria.
Las operaciones son síncronas; no esperan la carga iniciada por `use(...)`.
No se introduce almacenamiento, detección del navegador ni API reactiva propia.

## Consumidores originales y migración

| Consumidor | API utilizada | Comportamiento preservado |
|---|---|---|
| `ManagerCareCoreModule` | `init()` | Inicialización durante el bootstrap, en el mismo punto del constructor |
| `AccountService` | `changeLanguage()` | Precedencia de `sessionStorage.locale` sobre `account.langKey` |
| `NavbarComponent` | `changeLanguage()` | Guarda `locale` antes de delegar al servicio |
| `RegisterComponent` | `getCurrentLanguage()` | Conserva `langKey` en el payload de registro |
| `SettingsComponent` | `getCurrentLanguage()`, `changeLanguage()` | Guarda la cuenta, ejecuta `authenticate(account)` y cambia idioma solo si difiere |

Antes de recuperar la cuenta se usa `defaultI18nLang = 'es'`. Después,
`AccountService` mantiene `sessionStorage.retrieve('locale') || account.langKey`.
La persistencia de `locale` sigue siendo responsabilidad de Navbar, no del
servicio local. `RegisterService` y los cuerpos de los consumidores no cambian.

## Imports residuales

Imports de `JhiLanguageService` desde `ng-jhipster`:

- Producción: **0**.
- Tests: **0**.

El símbolo conserva su nombre, pero todos sus consumidores usan la implementación local.

## Pruebas automatizadas

| Ejecución | Suites | Pruebas | Fallos |
|---|---:|---:|---:|
| Baseline de 8I4B | 67 | 204 | 0 |
| Focal de 8I4C | 4 | 26 | 0 |
| Completa de 8I4C | 68 | 209 | 0 |

Delta: una suite y cinco pruebas adicionales. La nueva suite
`src/test/javascript/spec/app/shared/jhipster-compat/language.service.spec.ts`
contiene dos pruebas de inicialización y cambio síncrono, llamadas a
`TranslateService` y mutación visible de la configuración local.

Se añaden dos pruebas de precedencia en
`src/test/javascript/spec/app/core/user/account.service.spec.ts` y una de cambio
de idioma tras guardar en
`src/test/javascript/spec/app/account/settings/settings.component.spec.ts`.
La cobertura existente de Register conserva el contrato del payload `langKey`.
Se actualizan los imports/providers de Register, el módulo de tests y el mock
de idioma; no existía una suite útil de Navbar que justificara ampliar el alcance.

## Gates técnicos

| Gate | Resultado |
|---|---|
| `ngc` | Correcto, 0 diagnósticos |
| Jest focal | 4 suites / 26 pruebas / 0 fallos |
| Jest completo | 68 suites / 209 pruebas / 0 fallos; 0 errores y 0 omitidas |
| Webpack production | Correcto |
| Artefactos productivos | 73 |
| Validación estática | Correcta: referencias de index, Workbox, assets y 0 `[object Module]` |
| `i18n/es.json` | Correcto / HTTP 200 |
| Webpack development | Correcto |

Los gates no se repiten durante el cierre documental.
El warning `DefinePlugin / Conflicting values for 'process.env.NODE_ENV'`
es preexistente y no bloqueante. Se mantienen los avisos legacy de
`caniuse-lite`, `testURL` y TS151001 sin ampliación del alcance.

## Aceptación manual

Aceptación confirmada por el usuario en la autorización de cierre:

| Comprobación | Resultado |
|---|---|
| L1 — Bootstrap | Aprobado: arranque, español, traducciones y ausencia de errores de DI |
| L2 — Login / Account | Aprobado: cuenta sintética con `langKey = es`, login y UI en español |
| L3 — Selector de idioma | No aplicable: solo hay un idioma configurado y la UI no muestra selector |
| L4 — Settings | Aprobado: acceso, guardado y UI traducida |
| N — Console / Network | Aprobado: sin nuevos errores de idioma, DI, configuración o carga i18n |

Register manual: no requerido; su payload está cubierto automáticamente.
Precedencia sesión → cuenta: comprobación manual no requerida y cobertura
automatizada correcta.

## Restricción de idioma único

Se mantiene `LANGUAGES = ['es']`. No se añade otro idioma, JSON de traducciones,
selector artificial ni fallback. No se exige una transición visual a un idioma
que la aplicación no configura.

## Tooling y limpieza

Se utilizó Node 14.21.3 / npm 6.14.18 en un runtime oficial portable, aislado
bajo TEMP y verificado mediante SHA-256. No cambian PATH persistente, Node/npm
globales ni el grafo de dependencias.

La validación manual utilizó Java 21 y PostgreSQL 17.11 efímero con datos
sintéticos. Tras la aceptación se detienen frontend y backend, se eliminan el
contenedor y volumen exclusivos de 8I4C, sus datos, logs y runtime portable.
Java persistente, `node_modules` y recursos ajenos se conservan.

El aislamiento temporal de `eslint-loader` se restaura antes del commit,
comprobando igualdad SHA-256 con el original. F-B ESLint sigue diferido e
independiente de esta migración.

## Dependencias de ng-jhipster mantenidas y deuda

`ng-jhipster` no se retira todavía. Permanecen deliberadamente
`NgJhipsterModule`, `JhiConfigService` legacy en CoreModule,
`translatePartialLoader`, `missingTranslationHandler`,
`JhiTranslateDirective` / `[jhiTranslate]`, exports visuales y utilidades de tests.
No se modifican estos componentes en 8I4C.

La investigación 8I4A registró 468 apariciones de `[jhiTranslate]`, con parámetros,
markup y claves dinámicas; su sustitución requiere diseño posterior.

Quedan diferidos: 8I4D (bootstrap de traducciones), diseño de `jhiTranslate`,
exports visuales, retirada del paquete, F-B ESLint, traducción SSL de Health,
fechas nativas de Audits, Protractor/ChromeDriver, modernización de Node,
bloqueos ngcc restantes y Angular 16. Si aparece
`translation-not-found[health.indicators.ssl]`, sigue siendo preexistente,
no bloqueante y fuera de alcance.

## Hoja de ruta y conclusión

8I0 y 8I4A: investigación completada. 8I1 (paginación), 8I2 (eventos),
8I3 (alertas) y 8I4B (configuración): integradas.
8I4C: servicio local de idioma validado y aprobado para integración.

Siguiente etapa: **8I4D — translation bootstrap compatibility**, para el loader,
el handler y el último consumidor legacy de `JhiConfigService` del bootstrap.
No se inicia durante este cierre.

**8I4C: servicio local de idioma validado.**
