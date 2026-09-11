ocker compose exec -T postgres psql -U postgres -d incidents_db -c "SELECT i.id, i.title, i.status, c.code AS category_code FROM ""Incident"" i JOIN ""Category"" c ON c.id = i.""categoryId"" ORDER BY i.id;"
-- CONTRAER: una vez migrados los datos, categoryId pasa a ser obligatorio.
ALTER TABLE "Incident" ALTER COLUMN "categoryId" SET NOT NULL;
