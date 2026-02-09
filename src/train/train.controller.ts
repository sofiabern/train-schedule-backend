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
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { TrainService } from './train.service';

@Controller('trains')
export class TrainController {
  constructor(private trainService: TrainService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('name') name?: string) {
    return this.trainService.findAll(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTrainDto) {
    return this.trainService.create(dto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    return this.trainService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    return this.trainService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainService.remove(id);
  }
}
