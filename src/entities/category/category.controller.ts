import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
