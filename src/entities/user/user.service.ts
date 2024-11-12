import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private logger: Logger = new Logger(UserService.name);

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: createUserInput.email },
      });

      if (user) {
        throw new ConflictException();
      }

      const newUser = this.userRepository.create({
        ...createUserInput,
        password: bcrypt.hashSync(createUserInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
