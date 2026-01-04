import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateContactDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    nickname: string

    @IsString()
    @IsEmail()
    email: string
}
