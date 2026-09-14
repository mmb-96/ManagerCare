# Inventario previo de la Etapa 4

Fecha: 2026-09-13. Base inspeccionada: `d2de2e17ca0412fd6db3d856f27aeec100b30cea`.
Este inventario se completó antes de modificar código de producción.

| Área | Estado inicial | Cambio de compatibilidad previsto | Contrato que se conserva |
|---|---|---|---|
| JDK y build | Java 17, Maven Wrapper 3.6.3, compiler 3.8.1, Surefire/Failsafe 3.0.0-M4 | Java 21 y plugins de prueba/compilación actuales | Parámetros de método con `-parameters`; Gates A/B/C |
| Spring | Boot 2.7.18, Framework 5.3.31, Security 5.7.11 | Boot 3.5.x, Framework 6.2, Security 6.5 | Paths REST, JWT, 401/403/404 y `ResourceAuthorization` |
| JHipster | `io.github.jhipster:jhipster-framework:3.6.0`; 33 fuentes lo importan | `tech.jhipster:jhipster-framework:8.12.0`; APIs verificadas bajo el nuevo paquete | Cabeceras, paginación, configuración JWT y utilidades existentes |
| Problemas HTTP | `problem-spring-web:0.25.2`; 5 fuentes lo importan | 0.29.1, compatible con Spring 6 | JSON `application/problem+json` y semántica de errores |
| Jakarta | 38 fuentes importan `javax.persistence`, `javax.validation`, `javax.servlet`, `javax.annotation` o `javax.mail` | Migración mecánica a `jakarta.*` | Entidades, validación, filtros, mail y REST; `javax.sql.DataSource` no se cambia |
| Hibernate | Core 5.6.15 efectivo; dialectos JHipster fijos H2/PostgreSQL; `hibernate5` Jackson | Hibernate 6 gestionado por Boot y Jackson Hibernate 6 | SQL JPQL, secuencia `sequence_generator`, UTC y esquema Liquibase |
| Auditoría | Liquibase define la columna histórica `value`; la entidad la cita como `"value"` | Se conserva el quoting localizado | Tabla, changelog y persistencia de auditoría |
| Routing SPA | `ClientForwardController` con exclusiones explícitas | Se conserva tal cual | Deep links SPA sin reenviar `/api`, `/management` ni assets |

## Consultas y límites

- No hay consultas nativas. Las consultas JPQL activas están concentradas en los repositorios de categorías, objetivos, usuarios y puntos conseguidos; no se modifica su semántica sin una prueba que pruebe regresión.
- Los dialectos `FixedH2Dialect` y `FixedPostgreSQL10Dialect` proceden de la línea JHipster anterior y se sustituyen por selección automática de Hibernate 6, sin migraciones Liquibase.
- La configuración mantiene el datasource PostgreSQL 12.1, Liquibase, JWT HS512, SMTP deshabilitado por defecto y el perfil `runtime-local`, sin dependencias Cloud/Registry.
- `@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)` debe pasar a `@EnableMethodSecurity(securedEnabled = true)` para preservar tanto `@PreAuthorize` como `@Secured`.

## Deuda funcional histórica: objetivos de usuario

Angular sigue referenciando `/api/objetivos-user` y
`/api/objetivos-user-next`, pero el historial disponible no contiene ningún
mapping backend para esas rutas. No se restauran en la Etapa 4: hacerlo
definiría un contrato REST nuevo. Su resolución queda como deuda funcional
separada de una futura coordinación Angular/backend.
