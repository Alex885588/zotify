import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserMapper } from './mappers/user.mapper';
import { UserDto } from './dto/user.dto';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from "@nestjs/config";
import { LoggerService } from './services/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOSTNAME,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_MY_SECRET_KEY,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LoggerService, UserMapper, UserDto],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes("*");
  }

}
