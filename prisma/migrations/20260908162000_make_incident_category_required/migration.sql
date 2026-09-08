-- CONTRAER: una vez migrados los datos, categoryId pasa a ser obligatorio.
ALTER TABLE "Incident" ALTER COLUMN "categoryId" SET NOT NULL;
