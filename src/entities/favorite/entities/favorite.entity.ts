import { BaseEntity } from 'src/common/entities/base.entity';
import { Movie } from 'src/entities/movie/entities/movie.entity';
import { User } from 'src/entities/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity() //ManyToMany
@Unique('user_movie_unique', ['user_id', 'movie_id'])
export class Favorite extends BaseEntity {
  // Relation
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;

  // Relation
  @ManyToOne(() => Movie, (movie) => movie.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'movie_id',
  })
  movie: Movie;

  @Column({ name: 'movie_id' })
  movie_id: string;
}
