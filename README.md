# API de gestión de incidencias

API REST para registrar y consultar incidencias, organizadas por categorías. Incluye documentación interactiva en Swagger y una evolución de esquema que conserva los datos históricos.

## Tecnologías

TypeScript, NestJS, PostgreSQL 16, Prisma, Docker Compose, Swagger y class-validator.

## Arquitectura y recorrido
r
La aplicación separa HTTP, reglas de negocio y persistencia:

```text
POST /incidents
  -> CreateIncidentDto + ValidationPipe
  -> IncidentsController
  -> IncidentsService (comprueba la categoría)
  -> IncidentsRepository
  -> Prisma Client
  -> PostgreSQL
  -> respuesta HTTP JSON
```

El controller sólo recibe la petición y delega. El service contiene la regla de que una incidencia necesita una categoría existente; el repository concentra las consultas Prisma.

## Modelo de datos

```text
Category (id, code UNIQUE, name, createdAt)
       1 └──────────── N
Incident (id, title, description, status, categoryId FK, createdAt, updatedAt)
```

`Incident.categoryId` es obligatorio y referencia `Category.id`. PostgreSQL aplica tanto la clave foránea como el índice UNIQUE de `Category.code`.

## Migraciones y conservación de datos

Las migraciones no se modifican después de aplicarse. La secuencia implementa el patrón **expandir -> migrar datos -> contraer**:

1. `20260908154500_init_incident`: crea `Incident` y dos incidencias históricas.
2. `20260908160000_add_category_and_optional_relation`: crea `Category`, `code UNIQUE`, agrega `categoryId` nullable y su FK (**expandir**).
3. `20260908161000_move_legacy_incidents_to_general`: inserta `GENERAL` y actualiza las incidencias existentes para asignarla (**migrar datos**).
4. `20260908162000_make_incident_category_required`: vuelve obligatorio `categoryId` (**contraer**).

Así, las incidencias ya existentes no se eliminan ni quedan sin categoría cuando se endurece la restricción.

## Variables de entorno

Copiá `.env.example` como `.env`. No se versiona `.env`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/incidents_db?schema=public"
PORT=3000
```

## Levantar el proyecto

```bash
npm install
docker compose up -d
npx prisma migrate deploy
npm run seed
npm run start:dev
```

Abrí [http://localhost:3000/api](http://localhost:3000/api) para probar Swagger.

## Endpoints

| Método | Ruta | Uso |
|---|---|---|
| POST | `/incidents` | Crea una incidencia |
| GET | `/incidents` | Lista incidencias con su categoría |
| GET | `/incidents/:id` | Consulta una incidencia |
| POST | `/categories` | Crea una categoría |
| GET | `/categories` | Lista categorías |

Ejemplo para crear una incidencia:

```json
{ "title": "No puedo entrar", "description": "Error de autenticación", "status": "OPEN", "categoryId": 1 }
```

La validación responde `400` para DTO inválido. Se responde `404` cuando no existe una incidencia o categoría, `409` al violar un valor único y `500` para errores Prisma inesperados. Para demostrar la restricción real, hacé dos `POST /categories` con `{ "code": "RED", "name": "Red" }`: el segundo devuelve `409` porque PostgreSQL rechaza el índice UNIQUE.

## Seed

`npm run seed` usa `upsert` para `GENERAL` y `SOFTWARE`; la incidencia de ejemplo se busca antes de crearla y se actualiza si ya existe. Por eso se puede ejecutar repetidas veces sin duplicar datos.

## Reconstrucción desde una base vacía

```bash
docker compose down -v
docker compose up -d
npx prisma migrate deploy
npm run seed
```

La reconstrucción fue ejecutada y comprobada el 8 de septiembre de 2026. `prisma migrate deploy` aplicó las cuatro migraciones y el seed se ejecutó dos veces. Las dos incidencias históricas quedaron con `GENERAL`; quedaron exactamente dos categorías del seed (`GENERAL` y `SOFTWARE`) y una incidencia del seed. La evidencia completa, incluidos los resultados HTTP y de las restricciones de PostgreSQL, está en [docs/evidencia_pruebas.md](docs/evidencia_pruebas.md).

## Pruebas ejecutadas

- Swagger/OpenAPI (`GET /api-json`): `200`.
- Solicitud correcta (`POST /incidents`): `201`.
- Validaciones DTO: `400` al omitir `title` y al enviar un campo no permitido.
- Recursos inexistentes: `404` para una incidencia y una categoría inexistentes.
- Unicidad: el segundo `POST /categories` con el mismo `code` devolvió `409`.
- Clave foránea: PostgreSQL rechazó una inserción directa con `categoryId = 999999`; no se insertó ninguna fila inválida.
- Idempotencia: dos ejecuciones consecutivas del seed no duplicaron categorías ni la incidencia de ejemplo.

## migrate dev y migrate deploy

`prisma migrate dev` se usa sólo durante desarrollo: detecta cambios en el esquema, crea una nueva migración y puede requerir un entorno interactivo. `prisma migrate deploy` **no crea ni modifica migraciones**; aplica las ya versionadas, por eso es el comando usado para reconstrucción y despliegue.
