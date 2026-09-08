import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
export class CreateIncidentDto {
 @ApiProperty({ example: 'No funciona el acceso' }) @IsString() @IsNotEmpty() @MaxLength(150) title!: string;
 @ApiProperty({ example: 'El usuario recibe un error al iniciar sesión.' }) @IsString() @IsNotEmpty() @MaxLength(1000) description!: string;
 @ApiProperty({ example: 'OPEN', enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'], required: false }) @IsString() @IsIn(['OPEN','IN_PROGRESS','CLOSED']) status: string = 'OPEN';
 @ApiProperty({ example: 1 }) @IsInt() @Min(1) categoryId!: number;
}
