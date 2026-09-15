# Etapa 7C: Maven Wrapper

## Cambio

Se actualiza exclusivamente el Maven Wrapper desde la distribución Takari 0.5.6 con Maven 3.6.3 a Apache Maven Wrapper 3.3.4, tipo `bin`, que descarga Maven 3.9.16 desde Maven Central. El wrapper conserva una URL oficial, relativa al proyecto y sin credenciales ni rutas locales.

La distribución `bin` mantiene `.mvn/wrapper/maven-wrapper.jar` y sustituye el descargador Java legacy `MavenWrapperDownloader.java`, ya innecesario. No se añade checksum de distribución: el wrapper oficial generado no lo publica automáticamente y no se incorporó una edición manual adicional en esta etapa.

## Compatibilidad validada

El wrapper actualizado ejecuta Maven 3.9.16 sobre Temurin 21.0.12.1. No se modificaron `pom.xml`, dependencias ni código productivo. El workflow de backend incorpora una comprobación explícita de la versión efectiva del wrapper antes de los gates.

La validación focal confirmó la copia de `target/agents/mockito-core.jar`, Surefire, Failsafe y JaCoCo. CycloneDX 2.9.3 generó `target/managercare-backend-sbom.json` con formato CycloneDX JSON 1.6 y 141 componentes.

## Gates

- Gate A: 66 tests, 66 passed, 0 failed, 0 errors, 0 skipped.
- Gate B: 20 clases IT, 165 tests, 165 passed, 0 failed, 0 errors, 0 skipped.

## Validación Linux CI

La ejecución [35001453741](https://github.com/mmb-96/ManagerCare/actions/runs/35001453741) de la PR #19 completó correctamente en Ubuntu. El paso `Verify Maven Wrapper` confirmó explícitamente Apache Maven 3.9.16 con Temurin 21.0.12.1.

- Gate A: 66 tests, 0 failed, 0 errors y 0 skipped.
- Gate B: 20 clases IT, 165 tests, 0 failed, 0 errors y 0 skipped.
- CycloneDX: BOM JSON 1.6 con 141 componentes; artefacto `managercare-backend-sbom` publicado.

## Warnings

Se mantienen los warnings ya conocidos de convergencia de Commons IO y Apiguardian, y los warnings de validación de esquema de CycloneDX (`meta:enum` y `deprecated`).

Maven 3.9.16 expone dos avisos adicionales de configuración heredada: `resources` es un parámetro de solo lectura en `maven-resources-plugin`, y `fork` no es un parámetro conocido de `spring-boot-maven-plugin:repackage`. Ambos son no bloqueantes; no se corrigen en esta etapa para no ampliar el alcance más allá del wrapper.

GitHub también avisa de que `actions/upload-artifact@v4` se ejecuta con Node 24 por la deprecación de Node 20; queda como deuda de tooling fuera del alcance de esta etapa.
