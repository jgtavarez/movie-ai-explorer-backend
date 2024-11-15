import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Unique } from 'typeorm';

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
