import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class AppModule {}
