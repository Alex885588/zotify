import { Injectable } from "@nestjs/common";
import { UserDto } from "../dto/user.dto";
import { User } from "../entities/user";

@Injectable()
export class UserMapper {
    toDto(user: User): UserDto {
        const userDto = new UserDto();
        userDto.email = user.email
        userDto.fullName = user.fullName
        return userDto;
    }

    toEntity(userDto: UserDto): User {
        const user = new User();
        user.id = userDto.id;
        user.fullName = userDto.fullName;
        user.email = userDto.email;
        user.password = userDto.password;
        return user;
    }
}
