import { IsNumber } from 'class-validator';

export class FindOneDto {
    @IsNumber({}, { message: 'ID must be a number' })
    id: number;
}
