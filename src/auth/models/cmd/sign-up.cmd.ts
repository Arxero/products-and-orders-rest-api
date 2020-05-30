import { Length, IsString, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpCmd {
  @IsString()
  @Length(3, 30)
  username: string;

  @IsString()
  @Length(6, 30)
  password: string;

  @IsString()
  @IsEmail()
  @Length(6, 30)
  email: string;

  @IsString()
  @Length(2, 2)
  countryCode: string;
}
