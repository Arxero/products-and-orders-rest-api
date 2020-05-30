import { ApiProperty } from '@nestjs/swagger';

export class LoginCmd {
  username: string;
  password: string;
}
