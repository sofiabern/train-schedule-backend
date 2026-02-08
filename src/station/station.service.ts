import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    return this.prisma.station.findMany({
      where: name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const station = await this.prisma.station.findUnique({ where: { id } });
    if (!station) throw new NotFoundException('Station not found');
    return station;
  }

  async create(name: string) {
    const existing = await this.prisma.station.findUnique({
      where: { name },
    });
    if (existing) throw new ConflictException('Station with this name already exists');
    return this.prisma.station.create({ data: { name } });
  }

  async update(id: string, data: { name?: string }) {
    await this.findOne(id);
    if (data.name) {
      const existing = await this.prisma.station.findFirst({
        where: { name: data.name, NOT: { id } },
      });
      if (existing) throw new ConflictException('Station with this name already exists');
    }
    return this.prisma.station.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.station.delete({ where: { id } });
  }
}
