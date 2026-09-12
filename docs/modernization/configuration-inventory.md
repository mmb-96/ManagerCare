# Inventario de configuracion efectiva

No se elimina ninguna propiedad en esta etapa.

| Area | Prefijo | Estado actual | Futuro |
|---|---|---|---|
| Seguridad/JWT | `jhipster.security.authentication.jwt.*` | Necesario; produccion exige secreto externo | Desacoplar de JHipster tras Boot 3 |
| Datasource/JPA | `spring.datasource.*`, `spring.jpa.*`, Hikari | Necesario | Mantener; revisar dialectos con Hibernate 6 |
| Liquibase | `spring.liquibase.*` | Necesario | Fuente unica de esquema |
| Mail | `spring.mail.*`, `jhipster.mail.*`, `managercare.mail.enabled` | Opcional; runtime-local apagado | Mantener fail-closed |
| CORS | `jhipster.cors.*` | Opcional dev | Sustituible por propiedades Spring |
| Actuator | `management.*` | Necesario para health/metrics | Mantener rutas/exposicion |
| Logging | `logging.*`, `jhipster.logging.*` | Operacional | Sustituible |
| Eureka/Registry/Config | `eureka.*`, `spring.cloud.*`, `jhipster.registry.*`, `bootstrap*.yml` | Legacy/opcional; runtime-local apagado | Candidata a retirada |
| Cache HTTP | `jhipster.http.cache.*` | Opcional en assets prod | Candidata a retirada |
| Swagger | `jhipster.swagger.*`, perfil `swagger` | Legacy | Sustituir Springfox despues |
| Metricas | `management.metrics.*`, `jhipster.metrics.*` | Operacional opcional | Conservar Actuator |

Perfiles baseline: `dev`, `prod`, `runtime-local`, `swagger`,
`no-liquibase`, `tls`, `heroku`. `runtime-local` deshabilita Config,
Eureka y mail real y exige variables locales sinteticas.
