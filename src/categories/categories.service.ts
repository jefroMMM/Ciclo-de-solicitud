import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}
  create(dto: CreateCategoryDto) { return this.repository.create(dto); }
  findAll() { return this.repository.findAll(); }
}
