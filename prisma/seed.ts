import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const general = await prisma.category.upsert({ where: { code: 'GENERAL' }, update: { name: 'General' }, create: { code: 'GENERAL', name: 'General' } });
  const software = await prisma.category.upsert({ where: { code: 'SOFTWARE' }, update: { name: 'Software' }, create: { code: 'SOFTWARE', name: 'Software' } });
  const existing = await prisma.incident.findFirst({ where: { title: 'Incidencia de ejemplo del seed' } });
  if (existing) {
    await prisma.incident.update({ where: { id: existing.id }, data: { description: 'Registro idempotente creado por el seed.', status: 'OPEN', categoryId: software.id } });
  } else {
    await prisma.incident.create({ data: { title: 'Incidencia de ejemplo del seed', description: 'Registro idempotente creado por el seed.', status: 'OPEN', categoryId: software.id } });
  }
  // Las categorías obtenidas quedan disponibles para futuras extensiones del seed.
  void general;
}

main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
