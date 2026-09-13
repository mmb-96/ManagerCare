# Pre-Etapa 4: retirada de bloqueadores legacy

## Alcance

Esta pre-etapa elimina dependencias y scaffolding sin consumidores de negocio
que bloqueaban la preparación para Spring Boot 3. No cambia Java 17, Spring
Boot 2.7.18, contratos REST, JWT, Liquibase, PostgreSQL, modelo de datos ni
Angular.

| Componente retirado | Evidencia de ausencia de consumidor | Cambio localizado |
| --- | --- | --- |
| Springfox | No existía `Docket` ni configuración Java; solo anotaciones documentales de entidades | Dependencias, perfil Maven, propiedades, logs y anotaciones `ApiModel` |
| Spring Cloud Config | No había import/configuración activa después de retirar `bootstrap*.yml` | BOM, starter, bootstrap y Docker Registry |
| Eureka/Ribbon | No existían llamadas de negocio; el cliente estaba habilitado por anotación y propiedades legacy | `@EnableDiscoveryClient`, propiedades y compose |
| Cloud connector datasource | Solo se activaba con el perfil `cloud`; no tenía referencias ni pruebas | `CloudDatabaseConfiguration` |
| Refresh Scope | Solo tenía sentido con Config Client | `@RefreshScope` de logging |

JHipster Framework y Zalando Problem se conservan porque sostienen propiedades,
auditoría, cabeceras, errores y contratos existentes.

## Validación

| Gate | Resultado |
| --- | --- |
| Compilación | Correcta con Temurin 17.0.20.1 x64 |
| Focal | 12/12: `SecurityConfigurationFilesTest` y `ClientForwardControllerTest` |
| Gate A | 62 passed, 0 failed, 0 errors, 0 skipped |
| Gate B | 18 clases IT, 161 passed, 0 failed, 0 errors, 0 skipped |
| Gate C | PostgreSQL 12.1 aislado; Liquibase, health, JWT, cuenta, API autenticada, 401, 403 y 404 correctos |

El Gate C usó una base, usuario, contraseña y JWT sintéticos y efímeros. No se
inició Registry, Config Server ni ningún otro servicio externo.
