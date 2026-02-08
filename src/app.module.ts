import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StationModule } from './station/station.module';
import { TrainModule } from './train/train.module';
import { RouteModule } from './route/route.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StationModule,
    TrainModule,
    RouteModule,
    ScheduleModule,
  ],
})
export class AppModule {}
