# Contrato backend baseline

Fecha: 2026-09-12. Fuente: anotaciones de controladores y pruebas MockMvc. No
es una especificacion para redisenar: este contrato debe preservarse.

## Transversal

- Base REST: `/api`; cuerpos JSON salvo endpoints sin cuerpo.
- JWT: `Authorization: Bearer <token>`.
- `POST /api/authenticate` recibe `LoginVM` (`username`, `password`,
  `rememberMe`) y devuelve `JWTToken` con `id_token`.
- El token actual usa HS512 y conserva claims `sub`, `auth`, `exp`.
- Sin JWT: 401. Autorizado sin permiso: 403. Recurso inexistente: 404 si se
  alcanza el controlador; un recurso protegido no se revela antes (403).
- POST de entidad: 201, `Location`, `X-managerCareApp-alert`; PUT: 200;
  DELETE: 204. Las listas paginadas conservan `X-Total-Count` y `Link`.

## Cuenta

| Metodo | Ruta | Resultado |
|---|---|---|
| POST | `/api/register` | 201, `ManagedUserVM` |
| GET | `/api/activate?key=` | 200 o 500 con clave invalida |
| GET | `/api/authenticate` | 200 con login actual o cadena vacia |
| GET/POST | `/api/account` | 200 `UserDTO`; 400 con DTO invalido |
| POST | `/api/account/change-password` | 200; 400 con password invalida |
| POST | `/api/account/reset-password/init` | 200 |
| POST | `/api/account/reset-password/finish` | 200; 400 con clave/password invalida |
| POST | `/api/authenticate` | 200 `{ "id_token": "..." }`; 401 con credenciales invalidas |

## Dominio

CRUD actual (POST 201, PUT 200, GET 200/404, DELETE 204) y JSON de entidad:

| Coleccion | Proteccion/ruta adicional |
|---|---|
| categorias, categoria-ascs, tipos, objetivos | `/api/<coleccion>`; escritura ADMIN |
| puntos-conseguidos | lectura filtrada; `/api/puntos-conseguidos-user/{login}` valida propietario/equipo |
| objetivos-conseguidos | lectura filtrada; `/api/objetivos-ST/{login}` valida propietario/equipo |
| user-extras | lectura filtrada por propietario/equipo |
| users, teams | administracion/paginacion con `X-Total-Count` y `Link` |

`/management/audits` conserva GET paginado. `/management/**` requiere ADMIN,
salvo health, info y prometheus actuales.

## Evidencia estable

No se guardan snapshots completos: IDs, fechas y JWT serian fragiles. Las
pruebas MockMvc existentes validan campos, codigos y headers. Deben seguir
pasando `UserJWTControllerIT`, `AccountResourceIT`, todos los
`*ResourceIT` y `ResourceAuthorizationTest`.
