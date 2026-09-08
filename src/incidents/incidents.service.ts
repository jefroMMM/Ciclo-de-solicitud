import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../categories/categories.repository';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsRepository } from './incidents.repository';
@Injectable()
export class IncidentsService {
 constructor(private readonly repository: IncidentsRepository, private readonly categories: CategoriesRepository) {}
 async create(dto: CreateIncidentDto) {
   if (!await this.categories.findById(dto.categoryId)) throw new NotFoundException('Categoría no encontrada');
   return this.repository.create(dto);
 }
 findAll() { return this.repository.findAll(); }
 async findOne(id: number) { const incident = await this.repository.findById(id); if (!incident) throw new NotFoundException('Incidencia no encontrada'); return incident; }
}
