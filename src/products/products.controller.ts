import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { ReturnProductDto } from './dto/return-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user-roles.enum';
import { Role } from '../auth/role.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { FindProductsQueryDto } from './dto/find-products-query-dto';

@Controller('products')
@UseGuards(AuthGuard(), RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<ReturnProductDto> {
    const product = await this.productsService.createProduct(createProductDto);
    return {
      product,
      message: 'Produto cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findProductById(@Param('id') id): Promise<ReturnProductDto> {
    const product = await this.productsService.findProductById(id);
    return {
      product,
      message: 'Produto encontrado',
    };
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  async updateProduct(
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
      return this.productsService.updateProduct(updateProductDto, id);
    }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return {
      message: 'Produto removido com sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  async findProducts(@Query() query: FindProductsQueryDto) {
    const found = await this.productsService.findProducts(query);
    return {
      found,
      message: 'Produtos encontrados',
    };
  }
}
