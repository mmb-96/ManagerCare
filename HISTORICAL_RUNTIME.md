# Historical local runtime

This document describes the smallest isolated environment for running the
historical application. It does not modernize the project and it deliberately
does not contain credentials, JWT keys, or personal data.

## Required components

| Component                  | Required                     | Version / setting                                         | Notes                                                                                        |
| -------------------------- | ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| JDK                        | Yes                          | Temurin JDK 8                                             | A JRE is not enough for Maven compilation.                                                   |
| Maven                      | Yes                          | Project Maven Wrapper (Maven 3.6.3)                       | Do not substitute or upgrade it.                                                             |
| Node.js                    | Yes for the frontend         | 12.16.1                                                   | Maven provisions this exact local runtime under `node/`; it is intentionally ignored by Git. |
| npm                        | Yes for the frontend         | 6.14.2                                                    | Maven provisions it beside the local Node executable.                                        |
| PostgreSQL                 | Yes for a functional backend | PostgreSQL 12.1 image is the historical compose reference | Use an isolated, disposable local database.                                                  |
| JHipster Registry / Eureka | No                           | Disabled by `runtime-local`                               | Do not start it for local recovery.                                                          |
| SMTP                       | No                           | Disabled by `runtime-local`                               | No external delivery or Gmail is permitted.                                                  |
| Grafana / Prometheus       | No                           | Not started                                               | Monitoring is outside this local runtime.                                                    |
| Docker                     | Optional                     | Only a way to host PostgreSQL                             | It is not required if an equivalent isolated local PostgreSQL is available.                  |

## Ports

| Service                             | Port | Required                                               |
| ----------------------------------- | ---- | ------------------------------------------------------ |
| Backend Spring Boot                 | 8080 | Yes                                                    |
| Frontend Webpack development server | 9060 | Yes for interactive development                        |
| BrowserSync                         | 9000 | Optional (started by the frontend development tooling) |
| PostgreSQL                          | 5432 | Yes for the local database                             |
| Registry                            | 8761 | No                                                     |
| Local SMTP                          | 1025 | No; the application does not send mail in this profile |

## Isolated data and environment

Create a disposable PostgreSQL database and a dedicated local role. Keep its
values outside the repository. Before starting the backend, set all of these
environment variables in the current shell:

```powershell
$env:JAVA_HOME = 'path-to-a-jdk-8'
$env:MANAGERCARE_RUNTIME_DB_URL = 'jdbc:postgresql://localhost:5432/your_disposable_database'
$env:MANAGERCARE_RUNTIME_DB_USERNAME = 'your_disposable_role'
$env:MANAGERCARE_RUNTIME_DB_PASSWORD = 'a-local-synthetic-password'
$env:JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET = 'a-new-local-base64-key-at-least-64-bytes'
$env:MANAGERCARE_MAIL_ENABLED = 'false'
```

The key must be newly generated for the local environment; never reuse a
historic or production key. `application-runtime-local.yml` deliberately has
no fallback for any of these values. Liquibase runs with the existing `dev, faker` contexts and therefore the database must be disposable.

## Start sequence

1. On a fresh checkout, provision the versions pinned in `pom.xml` with the
   Maven Wrapper before using the frontend command below. This can download the
   pinned historical Node/npm binaries, but does not update their versions:

   ```powershell
   .\mvnw.cmd generate-resources
   ```

2. Start only the isolated PostgreSQL instance. Do not start Registry, Grafana,
   Prometheus, SMTP, or cloud services.
3. In one terminal, run the backend with the Maven Wrapper:

   ```powershell
   .\mvnw.cmd -P!webpack spring-boot:run "-Dspring-boot.run.arguments=--spring.profiles.active=dev,runtime-local"
   ```

   `bootstrap-runtime-local.yml` disables Spring Cloud Config before the
   application context starts; `application-runtime-local.yml` disables Eureka
   and real mail.

4. In another terminal, use the locally provisioned historical Node/npm runtime:

   ```powershell
   .\node\npm.cmd --scripts-prepend-node-path=true start
   ```

   The Webpack development server listens on port 9060 and proxies `/api`,
   `/auth`, `/management`, and related routes to port 8080. BrowserSync is an
   optional helper on port 9000.

5. Open the frontend only after the backend reports that Liquibase and the
   application context are ready. Use a synthetic local account created in the
   disposable database; do not use a historical, personal, or production
   account. Verify login, one authenticated API request, a basic screen, and
   logout.

## Build-only verification without PostgreSQL

The backend can be compiled without a database:

```powershell
.\mvnw.cmd -P!webpack -DskipTests package
```

The frontend can be compiled without a backend or browser:

```powershell
.\node\npm.cmd --scripts-prepend-node-path=true run build
```

H2 is intentionally test-scoped in this project. It is appropriate for the
backend integration tests, but it is not a substitute for validating the
historical PostgreSQL development runtime or Liquibase behaviour against
PostgreSQL.

## Docker option

`src/main/docker/postgresql.yml` references PostgreSQL 12.1. If Docker is
available and explicitly selected, run only that compose file with a
non-versioned environment or an isolated override containing synthetic values.
Do not run `app.yml`: it also starts the Registry and is not part of this
minimal environment. The recovery procedure starts no container unless the
local operator explicitly selects this PostgreSQL-only option.

## Security boundary

No credential, JWT, SMTP password, Registry password, or Grafana password may
be committed. Rotate local JWT material by generating a new local Base64 key,
updating the active shell or ignored local configuration, and restarting the
backend; it invalidates local sessions. Production rotation remains an
environment/deployment operation and must never copy values into this project.
