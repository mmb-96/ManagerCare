# Etapa 7B: CI y supply chain backend

## Estado inicial

El repositorio no tenía GitHub Actions, Dependabot ni un SBOM del backend. La rama conserva el Maven Wrapper actual; su actualización queda fuera de esta etapa.

## Vulnerabilidades

La API de Dependabot confirmó 237 alertas abiertas: 20 critical, 114 high, 81 medium y 22 low. Todas proceden de `package-lock.json`; Maven no tiene alertas abiertas. Las 134 alertas critical/high afectan a 61 paquetes npm únicos, con 33 alertas de scope runtime y 101 de build/development. Los directos runtime afectados son `@angular/common`, `@angular/compiler`, `@angular/core` y `moment`.

La remediación npm queda aplazada a una modernización coordinada de Angular 9, Angular CLI, Webpack 4, Protractor/Webdriver, BrowserSync y tooling JHipster. Esta etapa no configura Dependabot para npm, para evitar PRs aisladas incompatibles sobre ese stack histórico.

## GitHub Actions

`backend-ci.yml` se ejecuta en push a `master` y pull requests contra `master`, sobre `ubuntu-latest` con Temurin 21 y caché Maven de `actions/setup-java`. Usa el Maven Wrapper existente, habilita su permiso de ejecución y ejecuta Gate A (`-P!webpack test`) y Gate B (`-P!webpack verify`). Gate B usa H2 y Liquibase, por lo que no crea un servicio PostgreSQL.

Gate C sigue siendo una validación manual de release: requiere runtime completo, PostgreSQL real y flujos HTTP, por lo que no se ejecuta en cada push o pull request.

La configuración Maven existente conserva los agentes JaCoCo y Mockito mediante `${project.build.directory}/agents/mockito-core.jar`; la ruta es portable y no depende de Windows ni de una ruta física de `.m2`.

## Dependabot

Dependabot comprueba semanalmente únicamente Maven y GitHub Actions. No hay auto-merge, agrupaciones ni reglas de ignore masivas.

## SBOM

Se incorpora `org.cyclonedx:cyclonedx-maven-plugin` 2.9.3 como tooling de build, fijado explícitamente para reproducibilidad porque no lo gestiona el BOM de la aplicación. No se ata a un lifecycle: se invoca explícitamente con `cyclonedx:makeAggregateBom`, genera solo JSON bajo `target/managercare-backend-sbom.json`, no se adjunta al artefacto Maven y no se versiona. El workflow lo publica únicamente como artefacto temporal `managercare-backend-sbom`.

## Seguridad y decisiones de tooling

El workflow aplica `contents: read` y no usa secretos reales. Gate A y Gate B no requieren un override JWT ni credenciales PostgreSQL. Se usan acciones oficiales con tags mayores; el pinning por SHA se mantiene como deuda de supply chain posterior.

OWASP Dependency-Check no se añade: Dependabot no informa alertas Maven y añadirlo ahora aumentaría tiempo y ruido. CodeQL queda como candidato para una etapa posterior, una vez estabilizada la CI base.

## Pendientes

- Primera ejecución real del workflow en GitHub tras publicar una rama o pull request.
- CodeQL.
- Maven Wrapper 3.9.x.
- Modernización coordinada de Angular/npm.
- Automatización futura de Gate C.
