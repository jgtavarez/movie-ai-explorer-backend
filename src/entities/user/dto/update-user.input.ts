import { IsArray, IsUUID } from 'class-validator';

export class UpdateUserInput {
  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[];
}
