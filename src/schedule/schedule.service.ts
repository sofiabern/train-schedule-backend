import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    search?: string;
    sortBy?: 'departureTime' | 'arrivalTime' | 'trainName' | 'routeName';
    sortOrder?: 'asc' | 'desc';
    dayOfWeek?: number;
  }) {
    const {
      search,
      sortBy = 'departureTime',
      sortOrder = 'asc',
      dayOfWeek,
    } = params;
    const searchLower = search?.toLowerCase().trim();

    const schedules = await this.prisma.schedule.findMany({
      include: {
        train: true,
        route: {
          include: {
            routeStations: {
              orderBy: { order: 'asc' },
              include: { station: true },
            },
          },
        },
      },
    });

    let filtered = schedules;

    if (dayOfWeek !== undefined) {
      filtered = filtered.filter((s) => {
        const raw =
          'daysOfWeek' in s
            ? (s as { daysOfWeek?: number[] }).daysOfWeek
            : undefined;
        const days = Array.isArray(raw) ? raw : [];
        if (days.length === 0) return true;
        return days.includes(dayOfWeek);
      });
    }

    if (searchLower) {
      filtered = filtered.filter((s) => {
        const trainMatch = s.train.name.toLowerCase().includes(searchLower);
        const routeMatch = s.route.name.toLowerCase().includes(searchLower);
        const stationMatch = s.route.routeStations.some((rs) =>
          rs.station.name.toLowerCase().includes(searchLower),
        );
        return trainMatch || routeMatch || stationMatch;
      });
    }

    function getArrivalSortKey(s: (typeof filtered)[0]): number {
      const stops = s.route.routeStations ?? [];
      const last = stops[stops.length - 1];
      if (!last?.arrivalTime) return new Date(s.departureTime).getTime();
      const dateStr = s.departureTime.toISOString().slice(0, 10);
      return new Date(`${dateStr}T${last.arrivalTime}:00`).getTime();
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'departureTime') {
        cmp =
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime();
      } else if (sortBy === 'arrivalTime') {
        cmp = getArrivalSortKey(a) - getArrivalSortKey(b);
      } else if (sortBy === 'trainName') {
        cmp = a.train.name.localeCompare(b.train.name);
      } else if (sortBy === 'routeName') {
        cmp = a.route.name.localeCompare(b.route.name);
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return filtered;
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        train: true,
        route: {
          include: {
            routeStations: {
              orderBy: { order: 'asc' },
              include: { station: true },
            },
          },
        },
      },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async create(
    trainId: string,
    routeId: string,
    departureTime: string,
    daysOfWeek?: number[],
  ) {
    const days = (daysOfWeek?.length ? daysOfWeek : [0, 1, 2, 3, 4, 5, 6]).map(
      (d) => (d >= 0 && d <= 6 ? d : 0),
    );
    return this.prisma.schedule.create({
      data: {
        trainId,
        routeId,
        departureTime: new Date(departureTime),
        daysOfWeek: days,
      } as Prisma.ScheduleUncheckedCreateInput,
      include: {
        train: true,
        route: {
          include: {
            routeStations: {
              orderBy: { order: 'asc' },
              include: { station: true },
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      trainId?: string;
      routeId?: string;
      departureTime?: string;
      daysOfWeek?: number[];
    },
  ) {
    await this.findOne(id);
    const updateData: {
      trainId?: string;
      routeId?: string;
      departureTime?: Date;
      daysOfWeek?: number[];
    } = {};
    if (data.trainId !== undefined) updateData.trainId = data.trainId;
    if (data.routeId !== undefined) updateData.routeId = data.routeId;
    if (data.departureTime !== undefined)
      updateData.departureTime = new Date(data.departureTime);
    if (data.daysOfWeek !== undefined)
      updateData.daysOfWeek = data.daysOfWeek.map((d) =>
        d >= 0 && d <= 6 ? d : 0,
      );
    return this.prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        train: true,
        route: {
          include: {
            routeStations: {
              orderBy: { order: 'asc' },
              include: { station: true },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.schedule.delete({ where: { id } });
  }
}
