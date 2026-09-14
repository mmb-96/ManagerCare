# Etapa 6: reducción controlada de JHipster y Zalando

## Alcance y criterio

La etapa parte de `master` en `c07db750b21684285c15ac1210c35ea0d8ea929f`.
No cambia Angular, el esquema, changelogs de Liquibase, JWT, BCrypt, PostgreSQL ni
contratos REST. Se aplica solamente una sustitución de utilidad de bajo riesgo; el
resto del inventario deja explícita la deuda que debe mantenerse temporalmente.

## Dependencias inventariadas

| Dependencia | Antes | Después | Motivo |
|---|---:|---:|---|
| `tech.jhipster:jhipster-parent` 8.12.0 | BOM | BOM | Gestiona versiones del stack JHipster aún consumido. |
| `tech.jhipster:jhipster-framework` 8.12.0 | Directa | Directa | Configuración, utilidades y comportamiento runtime con consumidores reales. |
| `org.zalando:problem-spring-web` 0.29.1 | Directa | Directa | Mantiene el contrato `application/problem+json` de errores REST y seguridad. |
| `org.zalando:jackson-datatype-problem` 0.27.1 | Directa | Directa | Serializa los tipos Problem actuales. |

`problem-spring-web` también incorpora `problem-spring-common`,
`problem-violations` y `faux-pas` transitivamente. Zalando no entra solamente por
JHipster: se declara y se consume de forma directa.

## Inventario de componentes

| Componente | Dependencia u origen | Consumidores actuales | Uso | Impacto si se elimina | Acción |
|---|---|---|---|---|---|
| `ResponseUtil` | JHipster | Nueve recursos REST | `Optional` a 200/404 | Bajo, sin header adicional | ✅ Eliminado en 6A; sustituido por `ResponseEntity.of`. |
| `HeaderUtil` | JHipster | Recursos CRUD y `ExceptionTranslator` | Alertas de entidad y fallo | Cambia `X-managerCareApp-alert`/`params` | ❌ Mantener contractual. |
| `PaginationUtil` | JHipster | `AuditResource`, `UserResource` | `X-Total-Count` y `Link` | Angular y contrato REST dependen de ellos | ❌ Mantener contractual. |
| `RandomUtil` | JHipster | `UserService` | Claves de activación/reset y contraseñas | Debe preservar `SecureRandom`, alfabeto y longitud | ⚠️ Mantener. |
| `JHipsterProperties` | JHipster | Configuración web, JWT, mail, logging y auditoría | Binding de configuración vigente | Cambia propiedades runtime | ❌ Mantener. |
| `JHipsterConstants` / `DefaultProfileUtil` | JHipster | Arranque, perfiles, Liquibase y logging | Selección de perfiles | Riesgo de arranque | ⚠️ Mantener. |
| `SpringLiquibaseUtil` | JHipster | `LiquibaseConfiguration` | Liquibase asíncrono | Puede alterar readiness | ❌ Mantener hasta medición específica. |
| `ExceptionHandlingAsyncTaskExecutor` | JHipster | `AsyncConfiguration` | Tratamiento de fallos asíncronos | Semántica operacional | ⚠️ Mantener. |
| `WebConfigurer` / `CachingHttpHeadersFilter` | JHipster | Configuración web | CORS y cache de estáticos | Headers y CORS | ❌ Mantener. |
| `SecurityUtils` | Código propio | Servicio de usuarios, auditoría y autorización | Contexto de seguridad | Afecta roles y principal | ⚠️ No es dependencia JHipster directa; mantener. |
| Auditoría persistente | Código propio / Spring Boot | Repositorio, servicio, recurso | `/management/audits` | Endpoint y auditoría | ❌ Mantener. |
| Zalando Problem | Zalando | `SecurityConfiguration`, Jackson y `ExceptionTranslator` | 400/401/403/404/405 Problem | JSON y semántica de errores | ❌ Mantener. |
| `SecurityProblemSupport` | Zalando | `SecurityConfiguration` | 401/403 Problem | Contrato de seguridad | ❌ Mantener. |
| `LoggingAspect` | Código propio + constantes JHipster | Perfil de desarrollo | Diagnóstico | Bajo pero no residual demostrado | ⚠️ Mantener. |
| `FieldErrorVM` | Código propio | `ExceptionTranslator` | Errores de validación | JSON de validación | ❌ Mantener. |
| `ErrorVM` | — | No existe | — | — | 🧹 Sin artefacto que retirar. |

## Propiedades JHipster consumidas

| Grupo o propiedad | Consumidor | Equivalente Boot directo | Contractual | Acción |
|---|---|---|---|---|
| `jhipster.clientApp.name` | Alertas REST | No sin conservar los mismos nombres | Sí | Mantener. |
| `jhipster.cors.*` | `WebConfigurer` | Sí, con migración dedicada | Sí | Mantener. |
| `jhipster.security.authentication.jwt.*` | `TokenProvider`, secretos de producción | Parcial | Sí | Mantener. |
| `jhipster.mail.*` | `MailService`, secretos | Sí, con migración dedicada | Sí | Mantener. |
| `jhipster.logging.*` | Logging | Parcial | Operacional | Mantener. |
| `jhipster.audit-events.*` | `AuditEventService` | Parcial | Auditoría | Mantener. |
| cache HTTP de producción | `WebConfigurer` | Sí, con medición de headers | Sí | Mantener. |

Las propiedades Registry, Eureka, Config, Ribbon, Zipkin y Swagger ya no forman
parte de la configuración activa tras las etapas previas.

## Error handling y contrato

| Error | Estado y contenido actual | Consumidor / decisión |
|---|---|---|
| Validación y `BadRequestAlertException` | 400 Problem con alertas | REST y clientes existentes; mantener. |
| Autenticación | 401 `application/problem+json` | JWT y Angular; mantener `SecurityProblemSupport`. |
| Autorización | 403 `application/problem+json` | `ResourceAuthorization`; fail-closed. |
| Recurso o ruta inexistente | 404 Problem cuando se alcanza el controlador | Contrato backend. |
| Método no permitido | 405 Problem | Contrato backend. |
| Integridad/concurrencia/genérico | Advice de Zalando | Riesgo alto; no reescribir en esta etapa. |

## Cambios por bloque

### 6A — utilidades simples

Se retiró exclusivamente `ResponseUtil` de los recursos de auditoría, categoría,
categoría ascendente, objetivo, objetivos conseguidos, puntos conseguidos, tipo,
usuario extra y usuario. Las respuestas simples usan `ResponseEntity.of(optional)`.
La actualización de usuario conserva expresamente su alerta JHipster en la respuesta
200. Para `Optional.empty()` se conserva 404 sin cuerpo.

### 6B — configuración auxiliar

Sin cambios: Liquibase asíncrono, CORS/cache y ejecución asíncrona tienen impacto de
readiness o de cabeceras que requiere una etapa específica.

### 6C — propiedades

Sin cambios: todas las propiedades JHipster restantes tienen consumidor runtime real.

### 6D — Zalando Problem

Evaluado y retenido. Suprimirlo exigiría una reescritura extensa de
`ExceptionTranslator`, Jackson y `SecurityProblemSupport`, con riesgo directo sobre
el JSON de 400/401/403/404/405.

## Contratos preservados y validación

`ResponseEntity.of` conserva los 200 con cuerpo y los 404 de los endpoints de lectura
afectados. No se alteraron paths, métodos, JSON de éxito, JWT, `Authorization: Bearer`,
BCrypt, changelogs ni esquema.

| Gate | Resultado |
|---|---|
| A | 62 passed, 0 failed, 0 errors, 0 skipped. |
| B | 20 clases IT, 164 passed, 0 failed, 0 errors, 0 skipped. |
| C PostgreSQL 17.11 efímero | Liquibase, health, registro, activación, JWT, cuenta, APIs protegidas, alertas, paginación, auditoría y Problem validados. |

Gate C verificó `X-managerCareApp-alert`, `X-managerCareApp-params`,
`X-Total-Count`, `Link`, 401, 403 fail-closed para usuario ajeno y recurso huérfano,
404 Problem y 405 Problem. La base y todas las credenciales utilizadas fueron
sintéticas y efímeras.

## Deuda y siguiente reducción segura

La siguiente etapa deberá escoger una sola unidad de alto acoplamiento: una utilidad
propia compatible para alertas/paginación, la migración de `JHipsterProperties`, o la
revisión de error handling. No se debe eliminar el framework ni Zalando de forma
masiva hasta contar con pruebas contractuales equivalentes de headers, paginación,
errores, seguridad y readiness.
