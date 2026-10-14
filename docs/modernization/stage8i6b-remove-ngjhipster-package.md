# Etapa 8I6B — retirada del paquete ng-jhipster

## Alcance y base

Rama: `modernization/08i6b-remove-ngjhipster-package`.
Base: `a2bf6ec7778041f85b9bcc897b5b2d94e18d9ded`.

Retirada exclusiva de `ng-jhipster 0.12.0` del manifiesto, lock y instalación.
No cambia código, tests, Webpack, backend, CI ni ninguna otra dependencia.

## Estado inicial y readiness 8I6A

Imports productivos y de tests desde ng-jhipster: 0. Referencias ejecutables
bajo `src`: 0. El paquete todavía estaba declarado e instalado.

La investigación confirmó dependencia exclusiva de raíz, sin dependencies,
optionalDependencies, bundledDependencies, consumidores inversos ni transitivas
exclusivas. Sus peers siguen declarados/utilizados independientemente.

## Mutación del paquete

Método: patch textual mínimo y verificación de invariantes estructurales.

- `package.json`: retirada únicamente la línea `"ng-jhipster": "0.12.0"`.
- `package-lock.json`: retirada únicamente su entrada de cinco líneas.
- Se preservan orden, indentación, finales de línea, scripts y engines.
- No se retiran peers ni transitivas; no se ejecuta npm uninstall en el workspace.

## Invariantes estructurales

| Comprobación | Antes | Después |
| --- | ---: | ---: |
| Nodos recursivos del lock | 3422 | 3421 |
| Entradas de primer nivel | 1508 | 1507 |
| lockfileVersion | 1 | 1 |
| Nodos añadidos | — | 0 |
| Nodos conservados modificados | — | 0 |
| Transitivas exclusivas retiradas | — | 0 |

Único nodo retirado: `ng-jhipster`.
Ambos JSON son válidos. Igualdad profunda con los originales menos la clave
ng-jhipster: PASS en ambos archivos. Comparación textual exacta menos los
bloques retirados: PASS. Todas las rutas y propiedades restantes permanecen
intactas, incluidas versiones, resolved, integrity y requires.
Referencias al paquete, tarball y consumidores inversos en el lock: 0.

## Por qué no se utilizó npm uninstall

El ensayo offline de npm 6 en TEMP durante 8I6A generó normalización ajena:
reordenó `@popperjs/core`, produjo 126 inserciones/137 eliminaciones en el lock,
retiró 17 rutas y añadió 15, dejando 3420 nodos en vez de los 3421 esperados.
Ese resultado fue rechazado y no se copió al workspace.

## Reproducción limpia — nivel 1

Copias del manifiesto y lock modificados, sin copiar node_modules, en TEMP.
Node 14.21.3 / npm 6.14.18 oficiales portables.

```text
npm ci --ignore-scripts --offline --no-audit --no-fund
```

Resultado: código 0; npm informó 3355 paquetes instalados en 129,193 s.
Duración total registrada: 130,897 s. El número instalado es distinto del
recuento estructural del lock; no se utiliza como sustituto de sus invariantes.

Offline: sí. Scripts desactivados: sí. Sin acceso de red durante npm ci.
package.json y package-lock.json conservaron sus SHA-256 idénticos.
ng-jhipster físicamente ausente, también al recorrer instalaciones anidadas.
`npm ls ng-jhipster --all --json` no mostró la dependencia; su código 1 por
ausencia se interpretó junto con la salida y la inspección física.

Se mantiene intacto el postinstall histórico:

```text
node node_modules/protractor/bin/webdriver-manager update --gecko false
```

Por ello no se ejecutó una instalación con scripts habilitados.

## Workspace funcional — nivel 2

El paquete instalado se respaldó exclusivamente en TEMP y se verificaron sus
313 archivos antes de retirarlo. No se eliminó ningún otro paquete.
ng-jhipster estuvo ausente durante ngc, Jest, Webpack y runtime; no se restauró
para superar ningún gate. Imports y referencias ejecutables bajo src: 0.

El comentario histórico de `sort-by.directive.ts` permanece no ejecutable.
La documentación histórica de modernización permanece intacta.

## Blockers View Engine/ngcc restantes

| Paquete | Versión preservada |
| --- | --- |
| @fortawesome/angular-fontawesome | 0.6.0 |
| @ngx-translate/core | 11.0.1 |
| @ngx-translate/http-loader | 4.0.0 |
| ngx-cookie | 4.0.2 |
| ngx-infinite-scroll | 8.0.1 |
| ngx-webstorage | 5.0.0 |

Metadata y procesamiento ngcc esperado permanecen presentes. No se actualizaron
estos paquetes. ngcc sigue requerido; no se declara preparación para Angular 16.

## Validación automatizada aceptada

| Gate | Resultado real |
| --- | --- |
| Reproducción limpia offline | Correcta; código 0 |
| ngc | Código 0; 0 diagnósticos; 32,884 s totales |
| Compatibilidad focal | 13 suites / 77 tests / 0 fallos; Jest 33,175 s |
| Contratos locales incluidos | 62/62 verdes, más host SharedLibs y servicios |
| Jest completo | 78 suites / 278 tests / 0 fallos; 116,556 s |
| Webpack productivo | Código 0; 9 warnings; compilación 128,280 s |
| Artefactos productivos | 73, igual a baseline |
| Contenido/módulos ng-jhipster en artefactos inspeccionados | 0 |
| Index | 7 referencias / 0 ausentes |
| Workbox | 53 recursos / 0 ausentes |
| i18n/es.json | JSON válido |
| Assets referenciados | Presentes |
| [object Module] | 0 |
| Webpack development con aislamiento autorizado | Código 0; 7 warnings; compilación 51,886 s |

La baseline Jest era 78/278/0 y se mantiene. No cambian tests ni expectativas.
Dev canónico reprodujo el bloqueo F-B del parser de eslint-loader en
logs.component.ts: `Cannot read property 'map' of undefined`. Se aisló únicamente
ese loader en node_modules, con respaldo; no se cambió configuración versionada.
Los gates aceptados no se repiten durante el cierre.

## Runtime preparatorio

Java 21.0.12.1 y PostgreSQL 17.11, contenedor exclusivo
`managercare-8i6b-v1-postgres`, loopback y almacenamiento tmpfs sin volumen
persistente. Datos, cuenta y secretos exclusivamente sintéticos y temporales.

Backend: 200/UP. Frontend: 200. i18n/es.json: 200 y JSON válido.
Registro: 201; activación: 200; login/account/Metrics: 200.
Liquibase: lock libre y 23 changesets con contexto dev.
No se registran credenciales, claves ni tokens en este documento.

Docker no estaba disponible en el primer intento; se reanudó cuando el usuario
lo abrió, sin repetir gates. El helper temporal requirió decodificar una
respuesta JSON recibida como bytes; no se cambió la aplicación.

## Aceptación manual

Resultados aprobados explícitamente por el usuario, no automatizados:

| Comprobación | Resultado y alcance |
| --- | --- |
| R1 — Bootstrap/login | PASS: SPA, login sintético e interfaz en español |
| R2 — Traducción | PASS: traducciones/interpolaciones, sin claves crudas nuevas observadas |
| R3 — Compatibilidad local representativa | PASS: Administration → Metrics renderizado correctamente |
| R4 — Console/Network | PASS: sin nuevas regresiones observadas |

## Tooling y warnings

Node 14.21.3 / npm 6.14.18 oficiales portables; ZIP verificado contra SHASUMS256:
`47CFB919BB86AB681369636A9CB925E2BD61991AAD1638B2E38E61EC956796A6`.
node-gyp presente. PATH exclusivamente temporal; entorno persistente intacto.

`DefinePlugin — Conflicting values for 'process.env.NODE_ENV'`: preexistente,
no bloqueante. Se mantienen warnings legacy de Jest, Browserslist, Babel,
Webpack y Logback; no se corrigen en este cierre.

## Limpieza

Detenidos exclusivamente frontend, backend y auxiliares de 8I6B. Eliminado su
contenedor PostgreSQL; datos tmpfs descartados, sin volumen persistente.
Puertos temporales libres. No se utilizan prune ni limpiezas globales.

eslint-loader original restaurado, SHA-256 idéntico al respaldo:
`D2AE4ACCFA5D7072DF3F238E109FC8F2AE2495D56BDD773B781711E4D6FD3CD2`.
Aislamiento temporal retirado; F-B continúa diferido.

Eliminados los temporales exclusivos de 8I6B: instalación limpia, rollback del
paquete, runtime y credenciales, Node portable, logs, scripts, verificadores y
respaldo del loader tras comprobar restauración. No se restaura ng-jhipster.
Se conservan node_modules general, Java, caches globales y recursos ajenos.

## Hito y roadmap

ng-jhipster ausente del manifiesto, lock, instalación durante validación y
código ejecutable de ManagerCare: desacoplamiento completado.

8I0, 8I4A, 8I5A y 8I6A: investigación/readiness completadas.
8I1, 8I2, 8I3, 8I4B, 8I4C, 8I4D, 8I5B, 8I5C y 8I5D:
compatibilidades locales y retirada de imports integradas.
8I6B completa la retirada del paquete y su entrada del grafo.

## Trabajo restante y conclusión

Persisten seis blockers View Engine/ngcc, F-B ESLint, modernización de Node,
FontAwesome y ngx-translate, Protractor/ChromeDriver, sorting visual,
Health SSL y fechas nativas de Audits. No se amplía el alcance.

Blocker específico de ng-jhipster eliminado. **Angular 16: todavía no preparado.**
El siguiente trabajo será readiness/inventario separado de los blockers
restantes, sin asumir actualización simultánea. **No iniciado.**
