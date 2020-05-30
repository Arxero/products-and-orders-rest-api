import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './models/user.entity';
import { Repository, DeepPartial } from 'typeorm';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetUserDto } from './models/dto/get-user.dto';
import { ResponseError } from 'src/common/models/response';
import * as bcrypt from 'bcrypt';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}


  private hashRounds = 12;

  async create(payload: User): Promise<User> {
    payload.password = await bcrypt.hash(payload.password, this.hashRounds);
    try {
      return await this.usersRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetUserDto>> {
    const [items, total] = await this.usersRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
    });

    return new PagedData<GetUserDto>(
      items.map(x => new GetUserDto(x)),
      total,
    );
  }

  async findOne(params: DeepPartial<User>): Promise<User> {
    let user: User;
    try {
      user = await this.usersRepository.findOne(params);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!user)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return user;
  }

  async update(id: number, payload: User, request?) {
    const user = await this.findOne({ id });
    if (request) {
      this.authorize(user, request);
    }
    user.email = payload.email;
    user.role = payload.role;
    user.status = payload.status;
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<User>, request): Promise<User> {
    const user = await this.findOne(params);
    this.authorize(user, request);
    try {
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  private authorize(entity: User, request) {
    const tokenUser = new TokenUserPayloadDto(request.user);
    if (tokenUser.id !== entity.id && tokenUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }
  }
}
