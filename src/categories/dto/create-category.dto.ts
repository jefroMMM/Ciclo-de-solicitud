import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'SOFTWARE' })
  @IsString() @IsNotEmpty() @MaxLength(30) @Matches(/^[A-Z0-9_]+$/)
  code!: string;
  @ApiProperty({ example: 'Software' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  name!: string;
}
