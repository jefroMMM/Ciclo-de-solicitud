import { Module } from '@nestjs/common';
import { CategoriesRepository } from '../categories/categories.repository';
import { IncidentsController } from './incidents.controller';
import { IncidentsRepository } from './incidents.repository';
import { IncidentsService } from './incidents.service';
@Module({ controllers: [IncidentsController], providers: [IncidentsService, IncidentsRepository, CategoriesRepository] })
export class IncidentsModule {}
