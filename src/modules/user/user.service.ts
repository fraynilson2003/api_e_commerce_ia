import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/keyEnviroments';
import { LoginUserDto } from './dto/loginUser.dto';
import * as bcryptjs from 'bcryptjs';
import { UserToken } from './userToken.interface';
import { expirationToken } from './timeExpiration';
import { defaultPermissionUser } from './defaultPermissionUser';

@Injectable()
export class UserService {
  private secretJwt: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretJwt = this.configService.get<string>(JWT_SECRET)!;
  }

  async findOneByIdForToken(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'isAdmin'],
    });
  }

  async findOneByEmailForToken(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'isAdmin'],
    });
  }

  async findOneUserPermission(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'permissions', 'isAdmin'],
    });
  }

  async login(input: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: [
        {
          email: input.email,
        },
        {
          username: input.email,
        },
      ],
      select: ['id', 'email', 'password', 'isAdmin'],
    });

    if (!user) {
      throw new UnauthorizedException('No se encontro al usuario');
    }

    const isPasswordValid = await bcryptjs.compare(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = await this.generateToken({
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
    });

    return token;
  }

  async generateToken(payload: UserToken): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.secretJwt,
      expiresIn: expirationToken,
    });

    return accessToken;
  }

  //todo

  async createUser(input: CreateUserDto) {
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(input.password, salt);

    const createUser = this.userRepository.create({
      email: input.email,
      username: input.username,
      salt: salt,
      password: hashPassword,
      firstName: input.firstName,
      isAdmin: input.isAdmin,
      lastName: input.lastName,
      permissions: defaultPermissionUser,
    });

    const user = await this.userRepository.save(createUser);

    const token = await this.generateToken({
      email: user.email,
      id: user.id,
      isAdmin: user.isAdmin,
    });

    return token;
  }

  async findAll() {
    return this.userRepository.find();
  }
}
