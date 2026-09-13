# Boot 3 readiness (Etapa 3)

Estado de partida: Java 17, Spring Boot 2.7.18 y Spring Framework 5.3. Este
documento delimita los cambios que son seguros antes del salto a Boot 3; no
autoriza todavía Java 21, Jakarta, Hibernate 6 ni cambios de contrato.

## Bloqueadores e inventario

| Elemento | Uso actual | Problema para Boot 3 | Acción en Etapa 3 | Acción posterior |
| --- | --- | --- | --- | --- |
| Configuración web de seguridad | `WebSecurityConfigurerAdapter`, `antMatchers`, `authorizeRequests` | El adaptador y los matchers heredados desaparecen | Sustituido por `SecurityFilterChain`, `WebSecurityCustomizer` y `RequestMatcher` explícitos | Adoptar DSL lambda/`MvcRequestMatcher` cuando se actualice Security 6 |
| Method security | `@EnableGlobalMethodSecurity`, `@PreAuthorize` | Renombrado a `@EnableMethodSecurity` | Se mantiene: las expresiones y `-parameters` están protegidos por test | Migrar la anotación junto con Jakarta/Security 6 |
| JWT | Filtro propio y JJWT | Debe conservar la cadena y el token de Angular | `JWTConfigurer` eliminado; el mismo filtro se registra directamente | Evaluar JJWT y APIs de Security 6 sin cambiar claims |
| Springfox | Dependencias transitivamente usadas por JHipster | No es compatible con Boot 3 | Se mantiene, aislado como tooling; el runtime no depende de Swagger | Sustituir por springdoc o retirar antes del salto |
| Spring Cloud | Config, Eureka y Ribbon; runtime local los deshabilita | Ribbon y combinaciones JHipster/Cloud legacy no migran sin trabajo | Se mantiene por compatibilidad de perfiles históricos | Retirar Config/Eureka/Ribbon incrementalmente tras auditar prod |
| JHipster 6 | Properties, headers, paginación, perfiles, Liquibase, cache, audit | BOM/framework usa APIs javax y Spring antiguas | Se mantiene para no variar headers/errores | Extraer utilidades pequeñas y sustituir framework por fases |
| Zalando Problem | `problem-spring-web` 0.25.2 y `SecurityProblemSupport` | No es Jakarta/Boot 3 listo; además origina convergencia apiguardian | Se mantiene para conservar RFC7807 | Sustituir por ProblemDetail/handler compatible, con contrato explícito |
| Jackson Afterburner | Dependencia y bean explícitos | Acceso modular fallido en Java 17 durante Gate C | Retirado; no aporta formato JSON | Ninguna acción salvo volver a medir rendimiento si fuera necesario |
| Hibernate | Hibernate 5, JPQL/repositorios, dialecto PostgreSQL custom, auditoría | Hibernate 6 cambia dialectos, tipos, queries y APIs | Sin cambios | Revisar `FixedPostgreSQL10Dialect`, consultas/IDs/fechas, lazy loading y `PersistentAuditEvent` |

## JHipster

Se mantienen: `JHipsterProperties`, `HeaderUtil`, `ResponseUtil`,
`PaginationUtil`, `RandomUtil`, `DefaultProfileUtil`, Liquibase asíncrono,
cache, auditoría, logging y Problem. Son dependencias de contrato o de runtime
que no se pueden sustituir de forma segura en bloque.

La extracción posterior prioritaria es `HeaderUtil`/`ResponseUtil`/
`PaginationUtil`, ya que sus headers y paginación están en el contrato
`backend-contract.md`. Swagger y Problem se tratan por separado.

## Configuración y Cloud

`runtime-local` deshabilita Config Client, Eureka/Ribbon y correo efectivo;
Gate C confirma que el monolito funciona sin servicios externos. Los perfiles
dev/prod aún contienen configuraciones históricas de Registry/Eureka, por lo
que sus dependencias son legacy eliminables pero no se retiran en esta etapa.

Propiedades que deben revisarse exclusivamente al migrar a Boot 3: Cloud
Config bootstrap/import, Eureka/Ribbon, Springfox, Hikari/JPA dialect,
management/Actuator, mail Jakarta, cache, multipart y logging. No se eliminaron
propiedades funcionales en esta etapa.

## Mapa javax a Jakarta

Conteo en `src/main/java` (un archivo puede aparecer en más de una fila):

| Namespace | Nº archivos | Áreas afectadas | Riesgo |
| --- | ---: | --- | --- |
| `javax.persistence` | 11 | entidades, auditoría, relaciones e IDs | Alto: Hibernate 6/JPA 3 |
| `javax.validation` | 9 | entidades, DTOs y controladores | Medio |
| `javax.servlet` | 4 | CORS, filtros JWT y recursos REST | Alto: API Servlet 6 |
| `javax.annotation` | 4 | arranque, secretos, JWT y errores | Bajo |
| `javax.mail` | 1 | MailService | Medio |

Los tests añaden usos equivalentes de JPA, servlet y mail. No se realiza ningún
reemplazo masivo antes de Boot 3.

## Contrato y validación

El cambio de seguridad conserva el orden del filtro CORS/JWT, las rutas públicas
de login/registro/activación/reset, `/api/**` autenticada, management y las
cabeceras de seguridad. `ResourceAuthorization` y sus expresiones `#id` y
`#login` se mantienen; `-parameters` sigue activo en Maven.

Gate A/B/C deben proteger login, JWT Bearer, `/api/account`, 401/403/404,
paginación/headers, owner/team/admin, huérfanos fail-closed y routing SPA. No
se introducen snapshots JSON.
