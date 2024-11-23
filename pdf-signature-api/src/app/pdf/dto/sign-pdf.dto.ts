import { IsString, IsEmail, IsObject, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  page: number;
}

export class SignPdfDto {
  @IsString()
  filename: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;
}