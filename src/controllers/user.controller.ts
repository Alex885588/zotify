import { Controller, Get, Post, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { FindOneDto } from 'src/dto/findOne.user.dto';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { UpdateUserDto } from 'src/dto/update.user.dto';
import { RemoveUserDto } from 'src/dto/remove.user.dto';
import { SignInDto } from 'src/dto/signIn.user.dto';
import { IResponseBody, responseBody } from 'src/utils/responseBody/response.body';
import { AdminAuthGuard } from 'src/guards/admin.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard, AdminAuthGuard)
    async findAll(): Promise<IResponseBody> {
        const result = await this.userService.findAll();
        return responseBody(result)
    }

    @Get('by-id')
    @UseGuards(AuthGuard)
    async findOne(@Body() findOne: FindOneDto): Promise<IResponseBody> {
        const result = await this.userService.findOne(findOne.id);
        return responseBody(result)
    }

    @Post('/register')
    @UseGuards(AuthGuard)
    async create(@Body() userDto: CreateUserDto): Promise<IResponseBody> {
        const result = await this.userService.create(userDto);
        return responseBody(result)
    }

    @Put()
    @UseGuards(AuthGuard, AdminAuthGuard)
    async update(@Body() updateUserDto: UpdateUserDto): Promise<IResponseBody> {
        const result = await this.userService.update(updateUserDto.id, updateUserDto);
        return responseBody(result)
    }

    @Delete()
    @UseGuards(AuthGuard, AdminAuthGuard)
    async remove(@Body() removeUser: RemoveUserDto): Promise<IResponseBody> {
        const result = await this.userService.remove(removeUser.id)
        return responseBody(result)
    }

    @Post("login")
    async signIn(@Body() signInDto: SignInDto): Promise<IResponseBody> {
        const result = await this.userService.signIn(signInDto.email, signInDto.password);
        return responseBody(result)
    }

}
