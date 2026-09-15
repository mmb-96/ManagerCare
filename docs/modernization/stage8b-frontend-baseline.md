# Etapa 8B: baseline reproducible del frontend

## Alcance

Esta etapa valida el frontend histórico sin actualizar Angular, TypeScript,
RxJS, Webpack, JHipster ni el lockfile. Se parte de la evaluación de la etapa
8A y se usa exclusivamente el runtime portátil ya gestionado por el proyecto:
Node `12.16.1` y npm `6.14.2` en Windows. No se instaló Node globalmente.

No se modificaron `package.json`, `package-lock.json`, código Angular, backend,
runtime ni contratos. El SHA-256 de `package-lock.json` antes y después de las
validaciones es:

```
5D5F9FBD20903A01630BA134A20E5178868534256627F9F93024F5D174CBA699
```

## Entorno y comandos oficiales

Desde la raíz del repositorio, anteponer el directorio `node/` del proyecto al
`PATH` y ejecutar:

```powershell
node -v                 # v12.16.1
npm -v                  # 6.14.2
npm ci
npm run lint
npm test
npm run build
```

El build conserva el flujo histórico `webpack:prod`, Webpack `4.41.2` y la
salida en `target/classes/static`. No se usó `ng build` ni se regeneró el
lockfile.

## Gates ejecutados

| Gate | Comando | Resultado | Duración |
|---|---|---:|---:|
| F-A instalación | `npm ci` | Correcto; lockfile sin cambios | 312.85 s |
| F-B lint | `npm run lint` | 0 errores, 0 avisos | 93.60 s |
| F-C unitarios | `npm test` | 60 suites, 181 tests; 0 fallos, 0 errores, 0 omitidos | 416.58 s |
| F-D producción | `npm run build` | Correcto; 69 archivos generados | 412.01 s |
| Reproducibilidad instalación | `node_modules` eliminado + `npm ci` | Correcto; lockfile sin cambios | 237.61 s |
| Reproducibilidad build | `npm run build` tras la instalación limpia | Correcto; 69 archivos generados | 471.82 s |

Los unitarios se ejecutan con Jest, no con Karma/Chrome. El informe generado
queda en `target/test-results/jest/TESTS-results-sonar.xml`.

## Contrato frontend/backend

La revisión estática confirma que el cliente mantiene el contrato congelado:

- autenticación mediante `POST /api/authenticate` y `id_token`;
- propagación de `Authorization: Bearer` por el interceptor de autenticación;
- consulta de cuenta mediante `/api/account`;
- consumo de `X-Total-Count` para paginación;
- alertas dinámicas mediante `X-managerCareApp-alert` y
  `X-managerCareApp-params`;
- manejo de `HttpErrorResponse` sin introducir un parser alternativo de
  Problem+JSON.

No se modificó ninguna ruta, cabecera, JSON, JWT ni comportamiento de backend.

## E2E histórico

Chrome está instalado y el `postinstall` de npm descargó el WebDriver histórico.
Para completar F-F se reconstruyó `node_modules` mediante el `npm ci`
autorizado. Su `postinstall` histórico ejecutó automáticamente
`webdriver-manager update --gecko false`; no se ejecutó manualmente ninguna
actualización de WebDriver ni de dependencias.

El tooling descargado fue `webdriver-manager` 12.1.7, Selenium standalone
3.141.59 y ChromeDriver 114.0.5735.16. El Chrome instalado es
153.0.8010.37. Las versiones son incompatibles, por lo que Protractor no se
ejecutó: `directConnect` no puede usar de forma fiable ese driver con el
navegador actual. Se aplicó la regla de parada antes de levantar PostgreSQL,
backend o datos sintéticos.

Los nueve specs y sus 40 pruebas históricas siguen disponibles. Todos usan el
usuario histórico `admin/admin`; las pruebas de entidades requieren, además,
relaciones creadas previamente (categorías para CategoriaAsc, tipo para
Objetivo, usuario/categoría/responsable para UserExtra, usuario para Puntos y
usuario/objetivo para ObjetivosConseguidos). No se modificaron specs ni se
intentó un reintento: el bloqueo es de compatibilidad Chrome/WebDriver, no de
timing ni de datos.

## Baseline final

| Gate | Estado |
|---|---|
| F-A Install | ✅ |
| F-B Lint | ✅ |
| F-C Unit | ✅ |
| F-D Production build | ✅ |
| F-E Backend contract | ✅ |
| F-F E2E | ⚠️ bloqueado antes de ejecutar por Chrome 153 / ChromeDriver 114 |

## Avisos no bloqueantes

- `fsevents` intentó una compilación nativa opcional en Windows y no encontró
  el workload de C++ de Visual Studio. npm terminó correctamente; no afecta al
  build Windows y no se instaló tooling adicional.
- `ts-jest` recomienda `esModuleInterop=true`.
- Babel informa de bundles UMD grandes durante los unitarios.
- `caniuse-lite` está desactualizado.
- Webpack informa de tamaño de assets: el bundle principal es de 943 KiB y el
  entrypoint principal de 1.06 MiB; Swagger UI también supera sus límites
  recomendados.

No se ejecutó ningún comando de actualización (`npm update`, `npm audit fix`,
`ng update` o equivalente).

## Riesgo y siguiente etapa

No se detecta bloqueo P0 para reproducir instalación, lint, unitarios y build
con el stack histórico. Es P1 que la suite E2E Protractor no es ejecutable en
este equipo por la incompatibilidad Chrome 153 / ChromeDriver 114. Resolverlo
requerirá un navegador aislado compatible o un driver apropiado, ambos fuera
de la baseline y no aplicados aquí. Los avisos de dependencias opcionales,
tamaño y tooling son P2.

La etapa 8C debe iniciar el salto Angular de forma incremental y
major-by-major, manteniendo inicialmente Node 12.16.1, Webpack/JHipster,
NgModules y Protractor sin cambios simultáneos. Debe establecer primero un
entorno E2E aislado y datos deterministas antes de sustituir la herramienta
E2E o actualizar dependencias.
