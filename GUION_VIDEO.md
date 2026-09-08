# Guion de video (aprox. 2 min 30 s)

## 0:00 a 0:15 - Proyecto

En este proyecto construí una API para gestionar incidencias. Cada incidencia tiene título, descripción, estado y una categoría. Usé TypeScript, NestJS, Prisma, PostgreSQL, Docker Compose, Swagger y class-validator.

## 0:15 a 0:40 - Arquitectura

La aplicación está organizada para no concentrar todo en el controller. Cuando llega un POST a incidencias, primero se valida el DTO. Luego el controller delega al service; el service comprueba que la categoría exista y le pide al repository persistirla. El repository usa Prisma y Prisma se comunica con PostgreSQL. Finalmente, la API devuelve una respuesta JSON.

## 0:40 a 1:10 - Migraciones

La parte importante fue evolucionar la base sin perder datos. La primera migración creó la tabla Incident e insertó dos incidencias históricas. Después apliqué el patrón expandir, migrar datos y contraer. Primero creé Category y agregué categoryId como opcional. Luego creé la categoría GENERAL y asigné esa categoría a las incidencias que ya existían. Por último hice categoryId obligatorio.

## 1:10 a 1:35 - Datos y restricciones

Así se puede comprobar que las incidencias antiguas siguen existiendo y ahora pertenecen a GENERAL. También Category tiene code único a nivel de PostgreSQL. Si intento crear dos categorías con el mismo código, la segunda operación falla realmente en la base y la API traduce ese conflicto a HTTP 409.

## 1:35 a 2:00 - Swagger y petición HTTP

En Swagger puedo probar los endpoints. Por ejemplo, creo una categoría y después envío un POST a incidents con categoryId, título, descripción y estado. Swagger muestra la respuesta creada. También están los endpoints para listar incidencias, consultar una por id y listar categorías. Si envío datos inválidos, class-validator devuelve 400; si no existe el recurso, devuelve 404.

## 2:00 a 2:20 - Seed y reconstrucción

El seed es idempotente: usa upsert para las categorías y revisa la incidencia de ejemplo antes de crearla. Para reconstruir la base desde cero se bajan los volúmenes, se levanta PostgreSQL, se ejecutan prisma migrate deploy y npm run seed. Esto aplica las cuatro migraciones en orden y vuelve a dejar datos consistentes.

## 2:20 a 2:30 - Cierre

Finalmente, el README documenta el modelo, las migraciones, los comandos y la diferencia entre prisma migrate dev para desarrollo y prisma migrate deploy para aplicar migraciones ya existentes.
