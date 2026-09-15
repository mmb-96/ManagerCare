# Mini-etapa 7: observabilidad y secretos

## Logging

El aspecto de logging conserva únicamente los límites de método y el tipo de excepción. No registra argumentos, resultados, causas ni trazas que puedan incluir secretos o datos personales. `User.toString()` se limita a identificadores técnicos y estado; excluye credenciales, claves y PII. Los eventos de usuario, correo y reset se han reducido a mensajes operativos sin destinatarios, asuntos, cuerpos ni valores de clave.

## Configuración sensible

La credencial de datasource de desarrollo se obtiene de `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`; la contraseña del keystore TLS se obtiene de `SERVER_SSL_KEY_STORE_PASSWORD`. No se añaden valores por defecto sensibles. Si los valores históricos hubieran sido reales o reutilizados, su rotación debe realizarse fuera del repositorio.

## Actuator y Prometheus

No se cambia la exposición. `health`, `info` y `prometheus` siguen públicos. `env`, `configprops`, `logfile`, `loggers` y `threaddump` requieren `ROLE_ADMIN`; `metrics`, `mappings`, `beans` y `heapdump` no están expuestos. Prometheus mantiene clasificación C: su acceso debe restringirse por red, proxy o firewall.

## Gate C reset-password diagnostic

El primer diagnóstico de Gate C envió un JSON string con comillas al endpoint histórico, que espera el email como texto plano. El controlador devuelve 200 incluso si no encuentra usuario, por lo que 200 no demuestra existencia. La persistencia de `UserService.requestPasswordReset()` se validó con una prueba de commit real; no fue necesaria una corrección productiva.

## Validación final

Los focales de observabilidad y seguridad quedaron en verde (58 pruebas); Gate A finalizó sin errores observables y Gate B completó 20 clases IT y 165 pruebas sin fallos ni errores. Gate C se ejecutó contra PostgreSQL 17.11 efímero, con datos, credenciales y JWT sintéticos: Liquibase aplicó 30 changesets, el lock quedó liberado y el flujo de registro, activación, reset, login y APIs protegidas conservó sus respuestas históricas. El reset se validó enviando el email como texto plano, comprobando la persistencia y posterior limpieza de sus campos.

Un primer intento de login de Gate C utilizó una clave JWT sintética demasiado corta para HS512. Se repitió con una clave temporal de al menos 512 bits; no fue un defecto de aplicación ni se modificó configuración versionada. El escaneo de los logs temporales no encontró contraseñas, tokens Bearer/JWT, emails sintéticos ni cuerpos completos de correo. Las coincidencias de nombres de columnas de Hibernate contenían placeholders SQL, no valores.
