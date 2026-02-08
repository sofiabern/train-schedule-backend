import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  createUser(username: string, password: string) {
    return this.prisma.user.create({
      data: { username, password },
    });
  }

  getAllUsers() {
    return this.prisma.user.findMany();
  }
}
