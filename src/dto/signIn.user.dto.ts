import { IsString, IsEmail } from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
}
