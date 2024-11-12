import { User } from 'src/entities/user/entities/user.entity';

export class AuthResponse {
  jwt: string;
  user: User;
}
