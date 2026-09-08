import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (error.code === 'P2002') return response.status(HttpStatus.CONFLICT).json({ statusCode: 409, message: 'Ya existe un registro con ese valor único' });
    if (error.code === 'P2025') return response.status(HttpStatus.NOT_FOUND).json({ statusCode: 404, message: 'Registro no encontrado' });
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: 500, message: 'Error inesperado' });
  }
}
