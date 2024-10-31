import { IsString, IsEmail, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/enums/user.role.enum';

export class CreateUserDto {
    @IsString({ message: 'Full name must be a string' })
    fullName: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(5, { message: 'Password must be at least 5 characters long' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole
}
