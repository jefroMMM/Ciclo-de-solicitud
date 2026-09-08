import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateCategoryDto) { return this.prisma.category.create({ data }); }
  findAll() { return this.prisma.category.findMany({ orderBy: { id: 'asc' } }); }
  findById(id: number) { return this.prisma.category.findUnique({ where: { id } }); }
}
