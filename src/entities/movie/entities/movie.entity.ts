import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
@Unique('movie_imdbid_unique', ['imdbId'])
export class Movie extends BaseEntity {
  @Column({ name: 'imdb_id' })
  imdbId: string;

  @Column()
  title: string;

  @Column()
  poster: string;
}
