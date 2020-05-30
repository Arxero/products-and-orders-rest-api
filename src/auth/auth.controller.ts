import { Controller, Post, Body, UseGuards, HttpCode, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthJwtService } from './auth-jwt.service';
import { SignUpCmd } from './models/cmd/sign-up.cmd';
import { User } from 'src/users/models/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginCmd } from './models/cmd/login.cmd';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { TokenDto } from './models/dto/token.dto';
import { GetProfileDto } from './models/dto/get-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
    private authJwtService: AuthJwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() user: SignUpCmd): Promise<TokenDto> {
    return await this.authService.signUp(new User(user));
  }

  @UseGuards(LocalAuthGuard)
  
  @Post('login')
  @ApiBody({ type: LoginCmd })
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(new User(req.user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<IResponseBase> {
    const user = await this.usersService.findOne({ id: req.user.id });
    return new ResponseSuccess<GetProfileDto>({
      result: new GetProfileDto(user),
    });
  }

}
