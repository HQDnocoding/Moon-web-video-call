import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from 'src/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


const jwtSecret: string = process.env.JWTSECRET_MODULE || "pppppp000dd";


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
  JwtModule.register({
    secret: jwtSecret,
    signOptions: { expiresIn: '1h' }
  })],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule { }
