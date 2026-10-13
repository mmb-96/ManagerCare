# Etapa 8I5D — retirada de utilidades residuales de ng-jhipster en tests

## Alcance y base

Rama: `modernization/08i5d-remove-test-ngjhipster-utilities`.
Base: `3bd3019adb610ec78e4d6707cad22d241a5f489a`.

Se retiran exclusivamente imports y providers muertos de tests. No cambia
código productivo, configuración, templates, dependencias, backend ni CI.

## Imports residuales anteriores

Rutas relativas a `src/test/javascript/spec/`:

| Símbolo | Archivo | Función anterior |
| --- | --- | --- |
| JhiDataUtils | test.module.ts | Provider sin consumidor real |
| JhiDateUtils | test.module.ts | Provider sin consumidor real |
| JhiDateUtils | app/core/user/user.service.spec.ts | Provider sin consumidor real |
| JhiDateUtils | app/core/user/account.service.spec.ts | Provider sin consumidor real |
| JhiParseLinks | test.module.ts | Provider sin consumidor real |

## Análisis de providers muertos

Antes de retirarlos se comprobaron inyección por constructor, `TestBed.get`,
`TestBed.inject`, `inject`, dependencias de factories y providers, referencias
de tipos, llamadas a métodos, acceso a propiedades, mocks, spies y tokens,
incluidos alias y tokens de texto. No se encontró ningún consumidor real.
Por tanto, no se crearon reemplazos locales.

## Cambios

### test.module.ts

Retirados exclusivamente el import y los providers de `JhiDataUtils`,
`JhiDateUtils` y `JhiParseLinks`. Los demás providers permanecen intactos.

### user.service.spec.ts

Retirados el import y el provider de `JhiDateUtils`. Al quedar vacío el array,
se eliminó la propiedad `providers`. Tests y expectativas intactos.

### account.service.spec.ts

Retirados el import y únicamente la entrada `JhiDateUtils` de `providers`.
Los demás providers, tests y expectativas permanecen intactos.

## Resultado de dependencia en fuentes

| Comprobación bajo src | Resultado |
| --- | ---: |
| Imports productivos desde ng-jhipster | 0 |
| Imports de tests desde ng-jhipster | 0 |
| Referencias ejecutables a ng-jhipster | 0 |
| Referencias a JhiDataUtils / JhiDateUtils / JhiParseLinks | 0 |

Permanece un comentario histórico no ejecutable en
`src/main/webapp/app/shared/jhipster-compat/template/sort-by.directive.ts`.
No se modifica ni se confunde con un import o dependencia ejecutable.
La revisión no encontró exclusiones nuevas como `.only`, `.skip`, `fit`,
`fdescribe`, `xit` o `xdescribe` en los archivos modificados.

## Validación focal aceptada

| Conjunto | Suites | Tests aprobados | Fallos | Duración | Exit code |
| --- | ---: | ---: | ---: | ---: | ---: |
| UserService | 1 | 4 | 0 | 11,23 s | 0 |
| AccountService | 1 | 15 | 0 | 13,544 s | 0 |
| ManagerCareTestModule: Settings, Metrics y Tipo | 3 | 7 | 0 | 15,525 s | 0 |

Se identificaron 46 suites que importan `ManagerCareTestModule`. El smoke
utilizó tres consumidores representativos; no fue necesario ejecutar las
46 individualmente antes de Jest completo.

## Jest completo aceptado

Baseline: 78 suites / 278 tests / 0 fallos.
Resultado final: 78 suites / 278 tests aprobados / 0 fallos.
Duración: 91,739 s. Exit code: 0.
No se añadieron ni eliminaron tests. No se repiten durante el cierre.

Warnings no bloqueantes conocidos: `testURL` obsoleto y recomendación
`TS151001` de ts-jest sobre `esModuleInterop`. No se corrigen en esta etapa.

## Gates intencionalmente no requeridos

| Gate | Estado | Motivo |
| --- | --- | --- |
| ngc | No requerido | Código productivo intacto |
| Webpack productivo | No requerido | Solo imports/providers muertos de tests |
| Webpack desarrollo | No requerido | Solo imports/providers muertos de tests |
| Runtime | No requerido | Sin cambios funcionales |
| Validación manual | No requerida | Sin cambios visuales ni funcionales |

No son omisiones accidentales: el alcance solo requiere validar tests.

## Estado del paquete

`ng-jhipster 0.12.0` sigue declarado en `package.json`, presente en
`package-lock.json` e instalado en `node_modules`. Ambos archivos y el grafo
de dependencias permanecen intactos. Imports cero no significa paquete retirado.

## Tooling

Node 14.21.3 / npm 6.14.18 oficiales portables, bajo TEMP.
ZIP verificado mediante SHA-256 contra `SHASUMS256.txt` oficial:
`47CFB919BB86AB681369636A9CB925E2BD61991AAD1638B2E38E61EC956796A6`.
Se comprobó `node-gyp/bin/node-gyp.js`. PATH exclusivamente temporal;
entorno persistente intacto. No se ejecutó npm install/ci/update/uninstall.

## Limpieza

Eliminados exclusivamente `managercare-node14-8i5d-v1` y los ocho logs/XML
temporales `managercare-8i5d-v1-*` de los cuatro conjuntos de validación.
No había procesos Node usando ese runtime. No existió runtime de aplicación
en esta etapa. No se tocaron `node_modules`, Java, Docker, caches ni instalaciones
globales. No hubo aislamiento de eslint-loader que restaurar en 8I5D.

## Roadmap y trabajo restante

8I0 y 8I4A: investigación completada. 8I1, 8I2, 8I3, 8I4B, 8I4C y 8I4D:
compatibilidad local integrada. 8I5A: preparación completada. 8I5B y 8I5C:
compatibilidad de templates y retirada de imports productivos integradas.
8I5D completa la retirada de imports de tests.

8I6 retirará el paquete ng-jhipster y su grafo del lock mediante una etapa
separada con reproducción y validación propias. **8I6 no iniciada.**

## Diferidos

- F-B ESLint.
- Corrección visual de sorting.
- Traducción Health SSL.
- Fechas nativas de Audits.
- Protractor/ChromeDriver.
- Modernización de Node y FontAwesome.
- Modernización de ngx-translate y restantes blockers ngcc.
- Angular 16.

## Conclusión

Imports directos desde ng-jhipster bajo `src`: **0**.
Utilidades de tests retiradas sin reemplazos ni cambios de expectativas.
Paquete y grafo pendientes exclusivamente de 8I6.
