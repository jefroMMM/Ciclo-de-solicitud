-- Primera versión: incidencias sin categoría.
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- Datos históricos existentes antes de introducir categorías.
INSERT INTO "Incident" ("title", "description", "status", "updatedAt") VALUES
('No carga el portal', 'La pantalla principal queda en blanco al iniciar sesión.', 'OPEN', CURRENT_TIMESTAMP),
('Error al generar reporte', 'El reporte mensual muestra un error al descargar.', 'IN_PROGRESS', CURRENT_TIMESTAMP);
