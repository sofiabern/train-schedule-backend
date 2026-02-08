import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    return this.prisma.route.findMany({
      where: name
        ? { name: { contains: name, mode: 'insensitive' } }
        : undefined,
      include: {
        routeStations: {
          orderBy: { order: 'asc' },
          include: { station: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        routeStations: {
          orderBy: { order: 'asc' },
          include: { station: true },
        },
      },
    });
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async create(
    name: string,
    routeStations: {
      stationId: string;
      order: number;
      arrivalTime: string;
      departureTime: string;
    }[],
  ) {
    return this.prisma.route.create({
      data: {
        name,
        routeStations: {
          create: routeStations.map((rs) => ({
            station: { connect: { id: rs.stationId } },
            order: rs.order,
            arrivalTime: rs.arrivalTime,
            departureTime: rs.departureTime,
          })),
        },
      },
      include: {
        routeStations: {
          orderBy: { order: 'asc' },
          include: { station: true },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      routeStations?: {
        stationId: string;
        order: number;
        arrivalTime: string;
        departureTime: string;
      }[];
    },
  ) {
    await this.findOne(id);
    if (data.routeStations !== undefined) {
      await this.prisma.routeStation.deleteMany({ where: { routeId: id } });
    }
    return this.prisma.route.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.routeStations &&
          data.routeStations.length > 0 && {
            routeStations: {
              create: data.routeStations.map((rs) => ({
                station: { connect: { id: rs.stationId } },
                order: rs.order,
                arrivalTime: rs.arrivalTime,
                departureTime: rs.departureTime,
              })),
            },
          }),
      },
      include: {
        routeStations: {
          orderBy: { order: 'asc' },
          include: { station: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.route.delete({ where: { id } });
  }
}
