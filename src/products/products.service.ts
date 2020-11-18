import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
      return this.productRepository.createProduct(createProductDto);
  }

  async findProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne(productId, {
      select: ['price', 'name', 'description', 'id'],
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    return product;
  }

  async updateProduct(updateProductDto: UpdateProductDto, id: string): Promise<Product> {
    const product = await this.findProductById(id);
    const { name, price, description } = updateProductDto;
    product.name = name ? name : product.name;
    product.price = price ? price : product.price;
    product.description = description ? description : product.description;
    try {
      await product.save();
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }

  async deleteProduct(productId: string) {
    const result = await this.productRepository.delete({ id: productId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um produto com o ID informado',
      );
    }
  }

  async findProducts(
    queryDto: FindProductsQueryDto,
  ): Promise<{ products: Product[]; total: number }> {
    const products = await this.productRepository.findProducts(queryDto);
    return products;
  }
}
