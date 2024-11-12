import {
  BaseEntity as BaseEntityTypeOrm,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity extends BaseEntityTypeOrm {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({
    name: 'created_by_id',
  })
  created_by?: User;

  @Column({ name: 'created_by_id', nullable: true })
  created_by_id?: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({
    name: 'updated_by_id',
  })
  updated_by?: User;

  @Column({ name: 'updated_by_id', nullable: true })
  updated_by_id?: string;
}
