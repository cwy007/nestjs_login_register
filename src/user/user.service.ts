import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

function md5(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

@Injectable()
export class UserService {

  private logger = new Logger(UserService.name);

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ username: loginDto.username });
    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(loginDto.password)) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userRepository.findOneBy({ username: registerDto.username });
    if (user) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = registerDto.username;
    newUser.password = md5(registerDto.password);

    try {
      await this.userRepository.save(newUser);
      return 'User registered successfully';
    } catch (error) {
      this.logger.error('Error registering user', error.stack, newUser);
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
