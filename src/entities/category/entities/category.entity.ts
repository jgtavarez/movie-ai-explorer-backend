import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Unique } from 'typeorm';

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
}
