# Etapa 8J4B — caracterización de contratos de almacenamiento y autenticación

## Alcance, base y propósito

Base: `13b89373e8907d7144c4750098b150e991ea7ff6`.
Rama: `modernization/08j4b-storage-contract-characterization`.

Esta etapa congela el comportamiento existente de ManagerCare sobre
`ngx-webstorage 5.0.0`, antes de la futura actualización a 11.1.1 seleccionada
por 8J4A. No rediseña autenticación ni corrige comportamientos históricos.
Los resultados de validación ya aceptados se documentan sin repetir Jest
durante el cierre.

## Estado de producción y paquetes

Producción, backend, Webpack y CI permanecen sin cambios. `ngx-webstorage`
sigue en 5.0.0 en `package.json`, `package-lock.json` y el manifest instalado.
Los hashes de ambos package files y del manifest instalado no cambiaron.
El grafo conserva 3419 nodos recursivos, 1505 de primer nivel y lockfileVersion 1.
Los tres blockers ngcc permanecen presentes.

## Archivos de test

| Archivo | Operación | Propósito |
|---|---|---|
| `src/test/javascript/spec/app/core/auth/webstorage-contract.spec.ts` | Añadido | Contrato físico y semántica pública de storage |
| `src/test/javascript/spec/app/core/auth/auth-jwt.service.spec.ts` | Añadido | Remember-me, selección del token y logout |
| `src/test/javascript/spec/app/blocks/interceptor/auth.interceptor.spec.ts` | Añadido | Authorization y condición de URLs |
| `src/test/javascript/spec/app/core/auth/state-storage.service.spec.ts` | Añadido | Previous URL y limpieza |
| `src/test/javascript/spec/app/layouts/navbar/navbar.component.spec.ts` | Añadido | Locale de sesión y servicio de idioma |
| `src/test/javascript/spec/app/core/user/account.service.spec.ts` | Modificado | Orden de limpieza y navegación |
| `src/test/javascript/spec/helpers/storage-contract.ts` | Añadido | Configuración real y aislamiento selectivo |

AccountService conserva sus 15 tests previos y sus assertions; añade un test.
No se eliminó ningún test ni assertion para conseguir resultados verdes.

## Contrato físico

Configuración: `prefix: 'jhi'`, `separator: '-'`, `caseSensitive: false`
(valor predeterminado). La clave lógica se normaliza mediante
`logicalKey.toLowerCase()` antes de añadir prefijo y separador.

| Clave lógica | Clave física | Almacenamiento | Tipo y formato físico |
|---|---|---|---|
| `authenticationToken` | `jhi-authenticationtoken` | Local o Session según remember-me | String serializado como JSON |
| `locale` | `jhi-locale` | Session | String serializado como JSON |
| `previousUrl` | `jhi-previousurl` | Session | String serializado como JSON |

Para el valor exclusivamente ficticio `abc.def.ghi`, el texto físico es
`"abc.def.ghi"`, incluidas las comillas JSON. La lectura recupera la cadena
lógica original. No se sustituyó este formato por texto sin serialización.

## Semántica genérica y aislamiento

- `store`: serialización JSON y escritura en la clave física.
- `retrieve`: devuelve el valor lógico; una clave ausente devuelve `null`.
- JSON inválido: devuelve `null`; el warning de parseo se intercepta y restaura
  dentro del test, sin dejar ruido ni mocks globales persistentes.
- `clear(key)`: elimina la entrada física y el valor recuperable.
- Limpiar una clave inexistente no lanza excepciones.
- Los datos persistidos previamente se escriben directamente en Web Storage
  antes de resolver el servicio del test, verificando su lectura posterior.

Se usan servicios reales mediante DI y
`NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' })`.
El helper limpia exclusivamente las claves de caracterización mediante APIs
públicas y operaciones nativas selectivas, y reinicia TestBed. Esto evita que
la caché del paquete falsee las pruebas de datos preexistentes. No se utiliza
limpieza global de storage ni acceso a internals privados.

Fallback, SecurityError y cuota permanecen caracterizados por la investigación
de código de 8J4A; no se fuerzan mediante monkeypatches frágiles en esta etapa.

## Contrato de autenticación

- `rememberMe=true`: escribe `authenticationToken` en Local.
- `rememberMe=false`: escribe el token en Session.
- Login no elimina el token del almacenamiento opuesto.
- `getToken`: Local truthy → Session → `''`.
- Logout devuelve un Observable lazy: antes de subscribe ambos tokens
  permanecen; al suscribirse elimina las entradas de ambos stores y completa.

Estos comportamientos históricos quedan protegidos, no corregidos.

## Contrato del interceptor

AuthInterceptor conserva precedencia Local → Session y el formato
`Authorization: Bearer <token>`. Sin token se conserva la petición original
sin añadir Authorization. Las URLs relativas elegibles reciben el header;
una URL absoluta externa no lo recibe con la configuración actual.
No se modificó la condición de selección de URLs.

## Locale

`NavbarComponent.changeLanguage('en')` escribe `locale` en Session, bajo
`jhi-locale` con texto JSON `"en"`, e invoca
`JhiLanguageService.changeLanguage('en')`. No crea esa clave en Local.

La cobertura existente de AccountService se conserva: locale de sesión gana
a `account.langKey`; sin locale de sesión se utiliza el idioma de account.
No se duplicaron esos tests.

## Previous URL

StateStorageService conserva store/retrieve/clear, la clave `jhi-previousurl`,
la serialización JSON y el resultado `null` cuando falta la URL.
La navegación tras recuperar account conserva:
`getUrl → clearUrl → navigateByUrl`. El nuevo test verifica explícitamente
que la limpieza ocurre antes de navegar.

Los callers de `storeUrl()` en `user-route-access-service` y
`auth-expired.interceptor` permanecen intactos.

## Compatibilidad Swagger

Swagger UI continúa leyendo directamente `jhi-authenticationtoken` y usando
`JSON.parse`, con precedencia Local → Session. Su fuente no cambió.
El contrato queda protegido indirectamente por los tests de clave física
exacta y encoding JSON, sin tests frágiles de filesystem/HTML.

## Validación focal aceptada

| Suite | Tests | Fallos |
|---|---:|---:|
| Webstorage contract | 11 | 0 |
| AuthServerProvider | 6 | 0 |
| AuthInterceptor | 5 | 0 |
| StateStorageService | 3 | 0 |
| Navbar | 1 | 0 |
| AccountService | 16 | 0 |
| Total | 42 | 0 |

Seis suites aprobadas, cero omitidos. Duración Jest: 19,934 s.

## Nuevo baseline Jest completo

Baseline anterior: 78 suites / 278 tests / 0 fallos.
Se añadieron cinco specs con 26 tests y un caso al spec existente.
El helper nuevo no constituye una suite.

| Métrica | Esperado | Real |
|---|---:|---:|
| Suites | 83 | 83 |
| Tests | 305 | 305 |
| Fallos | 0 | 0 |
| Omitidos | 0 | 0 |

Duración Jest: 58,192 s. Ejecución total: 63,379 s. Código de salida: 0.
El informe `target/test-results/TESTS-results-jest.xml` es un artefacto
generado e ignorado; no forma parte del commit.

## Gates no ejecutados deliberadamente

ngc, Webpack production y Webpack development no eran necesarios y no se
ejecutaron. Tampoco se iniciaron backend, PostgreSQL, navegador ni runtime.
La compilación de los tests quedó cubierta por Jest. La etapa solo modifica
tests y, en su cierre, este documento.

## Seguridad y tratamiento de datos

Solo se utilizaron fixtures sintéticos de pruebas HTTP y storage. No se
utilizaron credenciales, JWT, Authorization ni datos reales del usuario.
Los tests utilizan APIs públicas de ManagerCare, ngx-webstorage y Web Storage,
sin assertions sobre cachés privadas, código ngcc o metadatos View Engine.

## Contrato de migración para 8J4C

La futura versión 11.1.1 deberá pasar estos tests sin cambiar sus expectativas.
Si una expectativa falla tras actualizar el paquete, se investigará como
posible incompatibilidad; no se adaptará automáticamente para obtener verde.

## NGCC, roadmap y siguiente etapa

Blockers ngcc: 3 → 3, sin cambios:
`@ngx-translate/core 11.0.1`, `@ngx-translate/http-loader 4.0.0` y
`ngx-webstorage 5.0.0`. No se declara todavía una reducción a dos.

8J0 completó el inventario; 8J1B integró la retirada de infinite-scroll;
8J2B integró la retirada de ngx-cookie; 8J3B integró el puente FontAwesome;
8J4A completó la selección de estrategia y objetivo para webstorage;
8J4B deja caracterizados los contratos de storage/auth con baseline 83/305/0.

Siguiente etapa prevista: 8J4C — actualización de ngx-webstorage 5.0.0 a 11.1.1.
No iniciada durante este cierre.
