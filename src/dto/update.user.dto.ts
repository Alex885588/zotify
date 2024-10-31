import { IsNumber, IsOptional, IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsNumber({}, { message: 'ID must be a number' })
  id: number;

  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
  password?: string;
}
