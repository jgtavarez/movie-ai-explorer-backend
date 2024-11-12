import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  EMAIL_LIMIT,
  NAME_LIMIT,
} from 'src/common/utils/constants/limits.constants';
import { ApiProperty } from '@nestjs/swagger';

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
  password: string;

  @ApiProperty()
  @Column({ default: true })
  active: boolean;
}
