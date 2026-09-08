-- MIGRAR DATOS: se crea GENERAL y se asigna a las incidencias históricas.
INSERT INTO "Category" ("code", "name") VALUES ('GENERAL', 'General');

UPDATE "Incident"
SET "categoryId" = (SELECT "id" FROM "Category" WHERE "code" = 'GENERAL')
WHERE "categoryId" IS NULL;
