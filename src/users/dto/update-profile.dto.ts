import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    username?: string;
    
    @IsOptional()
    @IsString()
    profilePhotoUrl?: string;
}