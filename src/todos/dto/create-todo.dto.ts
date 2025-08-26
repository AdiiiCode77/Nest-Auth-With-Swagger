import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty() @IsString() @MaxLength(120) title: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() done?: boolean;
}
