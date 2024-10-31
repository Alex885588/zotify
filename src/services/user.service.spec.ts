import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import * as utils from '../utils/utils';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let userMapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt_token'),
          },
        },
        {
          provide: UserMapper,
          useValue: {
            toDto: jest.fn((user) => user),
            toEntity: jest.fn((userDto) => userDto),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userMapper = module.get<UserMapper>(UserMapper)
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, fullName: 'John Doe', email: 'john@example.com' }];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users as User[]);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, fullName: 'John Doe', email: 'john@example.com' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto = { email: 'new@example.com', password: 'password' };
      const userEntity = { id: 1, ...userDto, password: 'hashed_password' };
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity as User);
      jest.spyOn(service, 'isEmailExists').mockResolvedValue(null);
      jest.spyOn(utils, 'isValidEmail').mockReturnValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');

      const result = await service.create(userDto);
      expect(result).toEqual(userEntity);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(service, 'isEmailExists').mockResolvedValue({ id: 1 } as User);

      const userDto = { email: 'existing@example.com', password: 'password' };
      await expect(service.create(userDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userDto = { fullName: 'Updated Name' };
      const existingUser: User = {
        id: 5,
        fullName: 'Old Name',
        password: 'oldPassword',
        email: 'oldEmail@example.com',
        createdAt: new Date(),
      };

      userRepository.findOneBy = jest.fn().mockResolvedValue(existingUser);
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      jest.spyOn(userMapper, 'toEntity').mockReturnValue(existingUser);
      jest.spyOn(userMapper, 'toDto').mockReturnValue({ ...existingUser, ...userDto });

      const result = await service.update(5, userDto);
      expect(result).toEqual({ ...existingUser, ...userDto });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const userDto = { fullName: 'Updated Name' };
      await expect(service.update(999, userDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const existingUser = { id: 1 };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser as User);
      jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('signIn', () => {
    it('should return a JWT token for valid credentials', async () => {
      const user = { id: 1, fullName: 'John Doe', email: 'john@example.com', password: 'hashed_password' };
      jest.spyOn(service, 'isEmailExists').mockResolvedValue(user as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.signIn('john@example.com', 'password');
      expect(result).toEqual({ token: 'jwt_token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'isEmailExists').mockResolvedValue(null);

      await expect(service.signIn('invalid@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getTableLength', () => {
    it('should return the count of users', async () => {
      jest.spyOn(userRepository, 'count').mockResolvedValue(5);

      const result = await service.getTableLength();
      expect(result).toBe(5);
    });
  });
});
