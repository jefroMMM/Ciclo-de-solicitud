ocker compose down -v
docker compose up -d
npx prisma migrate deploy
npm run seed
npm run seed
# Evidencia de pruebas reales

Fecha de ejecución: 8 y 9 de septiembre de 2026.

## Entorno y migraciones

Se levantó PostgreSQL 16 con `docker compose up -d`. El contenedor `ciclo-incidents-postgres` alcanzó el estado `healthy`.

En la reconstrucción completa se ejecutaron `docker compose down -v`, `docker compose up -d`, `npx prisma migrate deploy` y `npm run seed`. Prisma aplicó, en orden, las cuatro migraciones versionadas:

1. `20260908154500_init_incident`
2. `20260908160000_add_category_and_optional_relation`
3. `20260908161000_move_legacy_incidents_to_general`
4. `20260908162000_make_incident_category_required`

`npx prisma migrate status` terminó con `Database schema is up to date`.

## Conservación e idempotencia

Tras aplicar las migraciones, las incidencias históricas `No carga el portal` y `Error al generar reporte` quedaron asociadas a `GENERAL`.

El seed se ejecutó dos veces seguidas. La comprobación final de la base reconstruida fue: dos categorías del seed (`GENERAL` y `SOFTWARE`), una incidencia titulada `Incidencia de ejemplo del seed` y tres incidencias en total (dos históricas más la del seed). No hubo duplicados.

## Pruebas HTTP

| Prueba | Resultado |
|---|---|
| `GET /api-json` | `200` y documento OpenAPI disponible |
| `GET /incidents` | `200`, incluyó las incidencias históricas con categoría `GENERAL` |
| `POST /incidents` con datos válidos | `201` |
| `POST /incidents` sin `title` | `400` |
| `POST /categories` con campo adicional | `400` |
| `GET /incidents/999999` | `404` |
| `POST /incidents` con categoría inexistente | `404` |
| Segundo `POST /categories` con `code` repetido | `409` |

La prueba de unicidad creó `HTTP_UNIQUE` una vez y el segundo intento devolvió `409` con el mensaje `Ya existe un registro con ese valor único`.

## Restricción de base de datos

Se intentó insertar directamente en PostgreSQL una fila de `Incident` con `categoryId = 999999`. PostgreSQL rechazó la operación con la restricción `Incident_categoryId_fkey`; la verificación posterior devolvió cero filas con el título de prueba. Esto confirma que la FOREIGN KEY está aplicada por la base de datos, además de la validación `404` que expone la API para una categoría inexistente.

## Reconstrucción final

La base quedó reconstruida desde cero, con todas las migraciones aplicadas y el seed idempotente ejecutado dos veces. No se usó `prisma db push` ni se modificó ninguna migración existente.

## Repetición de la prueba el 9 de septiembre

Se repitió `docker compose down -v`, `docker compose up -d`, `npx prisma migrate deploy` y `npm run seed` dos veces. Prisma informó que las cuatro migraciones fueron aplicadas correctamente.

La consulta final devolvió las dos incidencias históricas con `GENERAL` y la incidencia del seed con `SOFTWARE`. PostgreSQL confirmó `Incident_categoryId_fkey` y el índice `Category_code_key` como UNIQUE. En HTTP se verificaron: creación de categoría (`201`), creación de incidencia (`201`), DTO incompleto (`400`), incidencia inexistente (`404`) y categoría repetida `VIDEO` (`409`).
