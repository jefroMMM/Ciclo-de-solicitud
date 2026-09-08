import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
@Injectable()
export class IncidentsRepository {
 constructor(private readonly prisma: PrismaService) {}
 create(data: CreateIncidentDto) { return this.prisma.incident.create({ data, include: { category: true } }); }
 findAll() { return this.prisma.incident.findMany({ include: { category: true }, orderBy: { id: 'asc' } }); }
 findById(id: number) { return this.prisma.incident.findUnique({ where: { id }, include: { category: true } }); }
}
