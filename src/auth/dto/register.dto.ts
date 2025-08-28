import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail() email: string;
  @ApiProperty({minLength:5})
  @IsString() @MinLength(5) username:string
  @ApiProperty({ minLength: 6 })
  @IsString() @MinLength(6) password: string;
}
