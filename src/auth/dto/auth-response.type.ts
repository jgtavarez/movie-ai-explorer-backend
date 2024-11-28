import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user/entities/user.entity';

export class AuthResponse {
  @ApiProperty()
  jwt: string;

  @ApiProperty({
    type: User,
  })
  user: Pick<User, 'id'>;
}
