# Gates oficiales de validacion

Ejecutar desde la raiz con Temurin JDK 8 y Maven Wrapper 3.6.3.
`-P!webpack` evita Angular y no usa servicios externos.

## Gate A - rapido

```powershell
.\mvnw.cmd -P!webpack test
```

Compila backend y ejecuta Surefire, que excluye `*IT*`/`*IntTest*`. Incluye
la regresion de autorizacion y la comprobacion de `-parameters`.

## Gate B - integracion

```powershell
.\mvnw.cmd -P!webpack verify
```

Ejecuta Gate A y Failsafe para las 18 clases IT / 161 tests esperados, con H2,
Liquibase y `src/test/resources/config/application.yml`. No requiere
PostgreSQL, Registry ni SMTP.

## Gate C - runtime PostgreSQL aislado

Usar una PostgreSQL 12.1 desechable y variables sinteticas fuera del repositorio:

```powershell
$env:JAVA_HOME = 'path-to-a-jdk-8'
$env:MANAGERCARE_RUNTIME_DB_URL = 'jdbc:postgresql://localhost:5432/your_disposable_database'
$env:MANAGERCARE_RUNTIME_DB_USERNAME = 'your_disposable_role'
$env:MANAGERCARE_RUNTIME_DB_PASSWORD = 'a-local-synthetic-password'
$env:JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET = 'new-local-base64-key-at-least-64-bytes'
$env:MANAGERCARE_MAIL_ENABLED = 'false'
.\mvnw.cmd -P!webpack spring-boot:run "-Dspring-boot.run.arguments=--spring.profiles.active=dev,runtime-local"
```

Comprobar `/management/health` = 200/`UP`, login, Bearer JWT,
`/api/account`, API autenticada y 401 tras logout. No iniciar Registry,
Config Server, SMTP, Grafana ni Docker completo. Ver `HISTORICAL_RUNTIME.md`.

## Build y CI

Wrapper, compiler 3.8.1, Surefire/Failsafe 3.0.0-M4, JaCoCo 0.8.5, MapStruct
1.3.1 y procesadores no cambian. Solo se habilita `parameters=true`: Java 8
compatible, sin dependencia ni cambio funcional, para `#id`/`#login`.
El enforcer aun limita Java a 8--13; JDK 17 queda para su etapa.

No se implementa CI ahora. Diseno minimo: GitHub Actions con JDK 8, cache Maven
y Gate A, sin secretos ni infraestructura. Gate B se incorporara tras validar
un runner limpio; JDK 17 queda fuera.
