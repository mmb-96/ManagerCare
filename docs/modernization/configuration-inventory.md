# Inventario de configuracion efectiva

Inventario creado en la baseline y actualizado tras retirar los clientes Cloud
y Springfox en la pre-Etapa 4.

| Area | Prefijo | Estado actual | Futuro |
|---|---|---|---|
| Seguridad/JWT | `jhipster.security.authentication.jwt.*` | Necesario; produccion exige secreto externo | Desacoplar de JHipster tras Boot 3 |
| Datasource/JPA | `spring.datasource.*`, `spring.jpa.*`, Hikari | Necesario | Mantener; revisar dialectos con Hibernate 6 |
| Liquibase | `spring.liquibase.*` | Necesario | Fuente unica de esquema |
| Mail | `spring.mail.*`, `jhipster.mail.*`, `managercare.mail.enabled` | Opcional; runtime-local apagado | Mantener fail-closed |
| CORS | `jhipster.cors.*` | Opcional dev | Sustituible por propiedades Spring |
| Actuator | `management.*` | Necesario para health/metrics | Mantener rutas/exposicion |
| Logging | `logging.*`, `jhipster.logging.*` | Operacional | Sustituible |
| Eureka/Registry/Config | Retirado en la pre-Etapa 4 | No se carga en runtime local ni en los perfiles backend | Eliminado |
| Cache HTTP | `jhipster.http.cache.*` | Opcional en assets prod | Candidata a retirada |
| Swagger | Retirado en la pre-Etapa 4 | Sin configuración ni dependencia backend | Eliminado |
| Metricas | `management.metrics.*`, `jhipster.metrics.*` | Operacional opcional | Conservar Actuator |

Perfiles baseline: `dev`, `prod`, `runtime-local`, `no-liquibase`, `tls`,
`heroku`. `runtime-local` no carga clientes Cloud,
deshabilita mail real y exige variables locales sinteticas.
