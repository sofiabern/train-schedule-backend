import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    return this.prisma.train.findMany({
      where: name
        ? { name: { contains: name, mode: 'insensitive' } }
        : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const train = await this.prisma.train.findUnique({ where: { id } });
    if (!train) throw new NotFoundException('Train not found');
    return train;
  }

  async create(name: string) {
    return this.prisma.train.create({ data: { name } });
  }

  async update(id: string, data: { name?: string }) {
    await this.findOne(id);
    return this.prisma.train.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.train.delete({ where: { id } });
  }
}
