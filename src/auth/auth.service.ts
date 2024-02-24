import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-paiload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userDate } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10), //guarda el password hasheado
      });
      await this.userRepository.save(user);
      delete user.password; // no muestra la contraseña pero si esta en la db
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };

      // falta retornar el jwt de acceso
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email }, //busca por email
      select: { email: true, password: true, id: true }, // selecciono que buscar
    });
    /* si no existe el user */
    if (!user) {
      throw new UnauthorizedException('Credetial are not valid (email)');
    }
    /* bcrypt compara las contraseñas */
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credetial are not valid (password)');
    }
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /* manage error */
  // el NEVER no regresa nunca un valor
  private handleDbError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
