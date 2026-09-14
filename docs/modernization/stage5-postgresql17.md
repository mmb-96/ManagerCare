# Etapa 5: PostgreSQL 17

## Objetivo

Actualizar la referencia operativa de PostgreSQL de 12.1 a 17.11 tras validar
la compatibilidad funcional del backend. La imagen queda fijada en
`postgres:17.11`; no se usa una etiqueta flotante.

## Stack final

- PostgreSQL 17.11.
- PostgreSQL JDBC 42.7.8, gestionado por el BOM de Spring Boot; no requiere
  un override manual y se validó contra PostgreSQL 12.1 y 17.11.
- Hibernate ORM 6.6.39.Final, con dialecto PostgreSQL autodetectado y sin
  dialecto custom.
- Liquibase actual, sin cambios de changelogs.

## Schema

Una base nueva y efímera creada por Liquibase produjo el mismo esquema lógico
en PostgreSQL 12.1 y 17.11:

- 30 entradas en `DATABASECHANGELOG`.
- 15 tablas y una secuencia.
- `DATABASECHANGELOGLOCK` liberado.
- La columna histórica `value` de auditoría permanece válida.

No se detectaron diferencias lógicas de esquema ni fue necesaria una migración
Liquibase de compatibilidad.

## Gates

| Gate | Resultado |
| --- | --- |
| Gate A | 62 passed, 0 failed, 0 errors, 0 skipped |
| Gate B | 20 clases IT; 164 passed, 0 failed, 0 errors, 0 skipped |
| Gate C con PostgreSQL 17.11 | Verde |

## Comparativa funcional

PostgreSQL 12.1 y 17.11 dieron el mismo resultado para health, registro,
activación, login, JWT Bearer, cuenta, puntos, objetivos y los casos de
seguridad 401, 403, 404 Problem y 405 Problem. No se detectaron diferencias
funcionales.

## Temporalidad

- Los valores `Instant` preservan el instante.
- `PuntosConseguidos.anyos`, `ObjetivosConseguidos.fechaApertura` y
  `ObjetivosConseguidos.fechaCierre` preservan el instante (`sameInstant`).
- No se cambiaron mappings ni se reintrodujo `OffsetTime`.

## Runtime

La única referencia Docker operativa actualizada es
`src/main/docker/postgresql.yml`, que usa `postgres:17.11`. Puertos, nombre
del servicio, variables y estructura de Docker permanecen sin cambios.
`application-runtime-local.yml` no fija ninguna versión PostgreSQL, por lo
que no requiere modificación.

Las referencias a PostgreSQL 12.1 de las etapas y gates anteriores se
conservan como documentación histórica.

## Migración real de datos

Esta etapa valida la compatibilidad de la aplicación contra una base nueva de
PostgreSQL 17. No se ha migrado una base histórica real de PostgreSQL 12 a
17, ni se han tratado datos reales.

Si existe una base real, su migración debe planificarse por separado. Las
alternativas incluyen dump/restore y `pg_upgrade`, con backup verificable,
ventana de downtime y validación posterior a la migración.

## Riesgos pendientes

- Definir la estrategia física para datos reales.
- Probar backup y restore antes de una intervención.
- Acordar downtime y rollback.
- Ejecutar validación funcional posterior a una migración real.
