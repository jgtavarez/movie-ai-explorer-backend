import {
  BadRequestException,
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
import { UpdateUserInput } from './dto/update-user.input';
import { CategoryService } from '../category/category.service';
import { MovieResp } from '../movie/dto/omdb-api.interfaces';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { generateCategoriesDetailsFormat } from 'src/open-ai/prompts';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private categoryService: CategoryService,
    private readonly openAiService: OpenAiService,
    private readonly movieService: MovieService,
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
      const { password, confirmPassword, ...restCreateUserInput } =
        createUserInput;
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const user = await this.userRepository.findOne({
        where: { email: createUserInput.email },
      });
      if (user) {
        throw new ConflictException('Email already exists');
      }

      const newUser = this.userRepository.create({
        ...restCreateUserInput,
        password: bcrypt.hashSync(password, 10),
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

  async update(
    updateUserInput: UpdateUserInput,
    userId: string,
  ): Promise<User> {
    try {
      const categories = await this.categoryService.findByIds(
        updateUserInput.categories,
      );

      const updateUser = await this.userRepository.preload({
        id: userId,
        categories,
      });

      return await this.userRepository.save(updateUser);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAllRecommendations(userId: string): Promise<MovieResp[]> {
    try {
      const user = await this.findOne(userId);

      if (!user.categories.length) {
        return [];
      }

      const { movies } = await this.openAiService.getUserRecommendations(
        generateCategoriesDetailsFormat(user.categories),
      );

      return this.movieService.checkMovieHallucination(movies);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
