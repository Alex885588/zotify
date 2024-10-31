import { IsNumber } from 'class-validator';

export class RemoveUserDto {
    @IsNumber({}, { message: 'ID must be a number' })
    id: number;
}
