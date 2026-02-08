import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'departureTime' | 'trainName' | 'routeName',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.scheduleService.findAll({
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(
      dto.trainId,
      dto.routeId,
      dto.departureTime,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(id, {
      trainId: dto.trainId,
      routeId: dto.routeId,
      departureTime: dto.departureTime,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
