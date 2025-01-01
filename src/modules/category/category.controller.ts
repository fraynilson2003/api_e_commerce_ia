import { Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(input: CreateCategoryDto) {
    return this.categoryService.createCategory(input);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
