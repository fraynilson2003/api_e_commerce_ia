import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getOrCreateCategory(name: CategoryEntity['name']) {
    const category = await this.categoryRepository.findOneBy({ name });
    if (category) {
      return category;
    }

    return this.categoryRepository.save({ name });
  }

  async createCategory(input: CreateCategoryDto) {
    const create = this.categoryRepository.create({
      name: input.name,
      description: input.description ?? undefined,
    });

    return this.categoryRepository.save(create);
  }

  async getAllCategories() {
    return this.categoryRepository.find();
  }
}
