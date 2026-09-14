# Temporal semantics in Stage 4

The historical JHipster `HibernateTimeZoneIT` compared textual JDBC values in
the auxiliary `jhi_date_time_wrapper` table. Under Hibernate 6, H2 and
PostgreSQL can represent the same instant differently according to the JDBC
driver and JVM timezone, so that text is not a ManagerCare contract.

ManagerCare requires preservation of the instant for `Instant` and its
functional `ZonedDateTime` fields. The timezone test therefore validates a
`persist`/`flush`/`clear`/`reload` round-trip by instant. It does not require a
literal offset or a regional `ZoneId`: production columns are `timestamp
without time zone`, and REST integration tests already assert same-instant
serialization.

`OffsetTime` occurs only in the JHipster test fixture. It is not used by the
domain, REST API or Angular. Its fixture column is `TIME WITHOUT TIME ZONE`,
which cannot portably preserve an offset across H2, PostgreSQL and JVM
timezones. No production schema or mapping migration is warranted.
