import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Post() @HttpCode(HttpStatus.CREATED) @ApiCreatedResponse({ description: 'Categoría creada' })
  create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
}
