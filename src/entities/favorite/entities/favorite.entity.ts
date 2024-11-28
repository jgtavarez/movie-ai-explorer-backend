import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Movie } from '../../movie/entities/movie.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity() // ManyToMany
@Unique('user_movie_unique', ['user_id', 'movie_id'])
export class Favorite extends BaseEntity {
  // Relation
  @ApiProperty({
    type: () => User,
  })
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
  @ApiProperty({
    type: () => Movie,
  })
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
