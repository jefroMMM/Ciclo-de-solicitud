import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IncidentsModule } from './incidents/incidents.module';
import { CategoriesModule } from './categories/categories.module';

@Module({ imports: [PrismaModule, IncidentsModule, CategoriesModule] })
export class AppModule {}
