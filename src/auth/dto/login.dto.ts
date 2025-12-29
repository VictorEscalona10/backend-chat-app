import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
}

export class VerifyLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}