import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';
@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
 constructor(private readonly service: IncidentsService) {}
 @Post() @HttpCode(HttpStatus.CREATED) @ApiCreatedResponse({ description: 'Incidencia creada' })
 create(@Body() dto: CreateIncidentDto) { return this.service.create(dto); }
 @Get() findAll() { return this.service.findAll(); }
 @Get(':id') @ApiNotFoundResponse({ description: 'Incidencia no encontrada' })
 findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
}
