import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthPermission } from '../permission/decorator/authPermission';
import { AddStockProductDto } from './dto/add-stock-product';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  async createProduct(
    @Body() input: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('image is required');
    }

    return this.productService.createProduct(input, file);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Post('add-stock')
  @AuthPermission({
    type: 'category',
    action: 'create',
  })
  async addStock(@Body() list: AddStockProductDto) {
    return await this.productService.addStockProduct(list);
  }
}
