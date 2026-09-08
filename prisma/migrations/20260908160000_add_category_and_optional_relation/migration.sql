-- EXPANDIR: se introduce Category y la relación todavía es opcional.
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_code_key" ON "Category"("code");

ALTER TABLE "Incident" ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
