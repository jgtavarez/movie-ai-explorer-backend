import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  EMAIL_LIMIT,
  NAME_LIMIT,
} from '../../../common/utils/constants/limits.constants';
import { Category } from '../../category/entities/category.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
@Unique('user_email_unique', ['email'])
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ length: NAME_LIMIT })
  name: string;

  @ApiProperty()
  @Column({ length: EMAIL_LIMIT })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: true })
  active: boolean;

  // Relations
  @ManyToMany(() => Category, (category) => category.id, {
    eager: true,
  })
  @JoinTable({ name: 'user_category' })
  categories: Category[];
}
