import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthJwtService } from './auth-jwt.service';
import { UserRole, UserStatus, User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenDto } from './models/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private authJwtService: AuthJwtService,
  ) {}

  async signUp(user: User): Promise<TokenDto> {
    user.role = UserRole.USER;
    user.status = UserStatus.CONFIRM;
    user = await this.usersService.create(user);
    return this.authJwtService.createToken(user);
  }

  async login(user: User) {
    return this.authJwtService.createToken(user);
  }
}
