import { User } from '../../entities/user/entities/user.entity';

export class AuthResponse {
  jwt: string;
  user: Pick<User, 'id'>;
}
