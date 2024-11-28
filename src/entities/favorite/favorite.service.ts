import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { ILike, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { GetAllFavoritesParams } from './dto/get-all-favorites.params';
import { ToggleFavoriteInput } from './dto/toggle-favorite.input';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private movieService: MovieService,
  ) {}

  private logger: Logger = new Logger(FavoriteService.name);

  async toggle(
    toggleFavoriteInput: ToggleFavoriteInput,
    userId: string,
  ): Promise<Favorite> {
    try {
      const { imdbId } = toggleFavoriteInput;
      const movie = await this.movieService.upsert({ imdbId });

      // Check if movie is already user favorite
      const favoriteFound = await this.favoriteRepository.findOneBy({
        movie_id: movie.id,
        user_id: userId,
      });
      if (favoriteFound) {
        return this.remove(favoriteFound.id, userId);
      }

      return this.create(movie.id, userId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async create(movie_id: string, user_id: string): Promise<Favorite> {
    try {
      const newFavorite = this.favoriteRepository.create({
        movie_id,
        user_id,
      });
      return await this.favoriteRepository.save(newFavorite);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async remove(id: string, user_id: string): Promise<Favorite> {
    try {
      const favorite = await this.favoriteRepository.findOneBy({
        id,
        user_id,
      });
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

  async findAll(
    getAllFavoritesParams: GetAllFavoritesParams,
    userId: string,
  ): Promise<Favorite[]> {
    try {
      const { search } = getAllFavoritesParams;

      return await this.favoriteRepository.find({
        where: {
          user_id: userId,
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

  async isUserFavorite(imdbId: string, userId: string): Promise<boolean> {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: {
          movie: {
            imdbId,
          },
          user_id: userId,
        },
        select: ['id'],
      });
      if (!favorite) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
