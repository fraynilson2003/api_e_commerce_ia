import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UtilitiesService } from 'src/global/utilities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AddStockProductDto } from './dto/add-stock-product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly utilities: UtilitiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(input: CreateProductDto, image: Express.Multer.File) {
    const transaction = await this.productRepository.manager.transaction(
      async (manager) => {
        const create = manager.create(ProductEntity, {
          name: input.name,
          slug: this.utilities.generateSlug(input.name),
          description: input.description ?? undefined,
          price: input.price,
        });

        //subimos imagen
        const uploadImage = await this.cloudinaryService.uploadBuffer(image);
        create.image = uploadImage;

        return await manager.save(ProductEntity, create);
      },
    );

    return transaction;
  }

  async addStockProduct({ list }: AddStockProductDto) {
    await this.productRepository.manager.transaction(async (manager) => {
      await Promise.all(
        list.map(async (det) => {
          const findProduct = await manager.findOneByOrFail(ProductEntity, {
            id: det.productId,
          });

          findProduct.stockQuantity += det.quantity;

          await manager.save(findProduct);
        }),
      );
    });
  }

  async findAll() {
    return this.productRepository.find();
  }
}
