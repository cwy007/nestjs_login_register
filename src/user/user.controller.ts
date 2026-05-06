import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.login(loginDto);
    const token = await this.jwtService.signAsync({
      user: {
        id: user.id,
        username: user.username,
      }
    });
    res.setHeader('Authorization', `Bearer ${token}`);
    return '登录成功';
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }
}
