import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;
}