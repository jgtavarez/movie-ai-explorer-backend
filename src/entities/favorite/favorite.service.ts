import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { ILike, Repository } from 'typeorm';
import { CreateFavoriteInput } from './dto/create-favorite.input';
import { CurrentUserType } from 'src/auth/decorators/current-user.decorator';
import { MovieService } from '../movie/movie.service';
import { GetAllFavoritesParams } from './dto/get-all-favorites.params';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private movieService: MovieService,
  ) {}

  private logger: Logger = new Logger(FavoriteService.name);

  async create(
    createFavoriteInput: CreateFavoriteInput,
    currentUser: CurrentUserType,
  ): Promise<Favorite> {
    try {
      const { imdb_id } = createFavoriteInput;
      const movie = await this.movieService.create({ imdb_id });
      console.log(movie.id, currentUser.id);

      // Check if movie is already user favorite
      const favoriteFound = await this.findOne(movie.id, currentUser.id);
      if (favoriteFound) {
        throw new ConflictException();
      }

      const newFavorite = this.favoriteRepository.create({
        movie_id: movie.id,
        user_id: currentUser.id,
      });
      return await this.favoriteRepository.save(newFavorite);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOne(movieId: string, userId: string): Promise<Favorite | null> {
    try {
      const favorite = await this.favoriteRepository.findOneBy({
        movie_id: movieId,
        user_id: userId,
      });

      return favorite;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(
    getAllFavoritesParams: GetAllFavoritesParams,
    currentUser: CurrentUserType,
  ): Promise<Favorite[]> {
    try {
      const { search } = getAllFavoritesParams;

      return await this.favoriteRepository.find({
        // take: , TODO
        // skip: ,
        where: {
          user_id: currentUser.id,
          movie: {
            ...(search && {
              title: ILike(`%${search}%`),
            }),
          },
        },
        order: { created_at: 'DESC' },
        select: ['id', 'movie', 'created_at'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
  //   return `This action updates a #${id} favorite`;
  // }

  async remove(id: string, currentUser: CurrentUserType): Promise<Favorite> {
    try {
      const favorite = await this.findOne(id, currentUser.id);
      if (!favorite) {
        throw new NotFoundException();
      }

      await this.favoriteRepository.remove(favorite);

      favorite.id = id;
      return favorite;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
