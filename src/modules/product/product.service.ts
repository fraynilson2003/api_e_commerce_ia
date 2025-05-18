import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(input: CreateProductDto) {
    const create = this.productRepository.create({
      name: input.name,
      description: input.description ?? undefined,
      price: input.price,
    });

    return this.productRepository.save(create);
  }
}
