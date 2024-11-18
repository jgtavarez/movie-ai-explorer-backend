import { Injectable, Logger } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private logger: Logger = new Logger(CategoryService.name);

  async findByIds(ids: string[]): Promise<Category[]> {
    try {
      return await this.categoryRepository.findBy({ id: In(ids) });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        order: { title: 'ASC' },
        select: ['id', 'title', 'image'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
