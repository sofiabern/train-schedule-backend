import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() body: { username: string; password: string }) {
    return this.userService.createUser(body.username, body.password);
  }

  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }
}
