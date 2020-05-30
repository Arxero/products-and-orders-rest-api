import { IUser, UserRole, UserStatus } from '../user.entity';

export class GetUserDto implements IUser {
  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.username = data.username;
  }
  id: number;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
