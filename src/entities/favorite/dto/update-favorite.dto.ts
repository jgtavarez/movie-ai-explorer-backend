import { PartialType } from '@nestjs/swagger';
import { CreateFavoriteInput } from './create-favorite.input';

export class UpdateFavoriteDto extends PartialType(CreateFavoriteInput) {}
