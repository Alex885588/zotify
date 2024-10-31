import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from 'src/dto/create.user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private userMapper: UserMapper,
    ) { }

    async findAll(): Promise<UserDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => this.userMapper.toDto(user));
    }

    async findOne(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.userMapper.toDto(user);
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {
        const isUserExists = await this.isEmailExists(userDto.email);
        if (isUserExists) {
            throw new ConflictException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userDto.password, salt);

        const user = this.userMapper.toEntity({ ...userDto, password: hashPassword });
        const savedUser = await this.userRepository.save(user);
        return this.userMapper.toDto(savedUser);
    }

    async update(id: number, userDto: UserDto): Promise<UserDto> {
        const updatedUser = await this.userRepository.findOneBy({ id });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const entity = this.userMapper.toEntity(userDto);
        const result = await this.userRepository.update(id, entity);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.userMapper.toDto(entity);
    }

    async remove(id: number): Promise<boolean> {
        const deletedUser = await this.userRepository.findOneBy({ id });
        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return true;
    }

    async signIn(email: string, password: string): Promise<{ token: string }> {
        const user = await this.isEmailExists(email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { id: user.id, fullName: user.fullName, email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token };
    }

    async isEmailExists(email: string): Promise<User> {
        return await this.userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
    }

    async getTableLength(): Promise<number> {
        return await this.userRepository.count();
    }
}
