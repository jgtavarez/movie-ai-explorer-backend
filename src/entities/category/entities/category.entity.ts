import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum CategoryTitle {
  Action = 'action',
  Adventure = 'adventure',
  Comedy = 'comedy',
  Horror = 'horror',
  Musical = 'musical',
  Romance = 'romance',
}

@Entity()
@Unique('movie_title_unique', ['title'])
export class Category extends BaseEntity {
  @ApiProperty()
  @Column({ enum: CategoryTitle, type: 'enum' })
  title: CategoryTitle;

  @ApiProperty()
  @Column()
  image: string;
}
