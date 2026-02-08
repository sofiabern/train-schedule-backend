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
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteService } from './route.service';

@Controller('routes')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  findAll(@Query('name') name?: string) {
    return this.routeService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRouteDto) {
    return this.routeService.create(dto.name, dto.routeStations);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routeService.update(id, {
      name: dto.name,
      routeStations: dto.routeStations,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routeService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routeService.remove(id);
  }
}
