import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
@Unique('movie_imdbid_unique', ['imdb_id'])
export class Movie extends BaseEntity {
  @ApiProperty()
  @Column()
  imdb_id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  poster: string;
}
