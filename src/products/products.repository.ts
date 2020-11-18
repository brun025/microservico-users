import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { FindProductsQueryDto } from './dto/find-products-query-dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findProducts(
    queryDto: FindProductsQueryDto,
  ): Promise<{ products: Product[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { price, name, description } = queryDto;
    const query = this.createQueryBuilder('product');
    query.where('product.status = :status', { status });

    // if (email) {
    //   query.andWhere('product.email ILIKE :email', { email: `%${email}%` });
    // }

    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    // if (role) {
    //   query.andWhere('product.role = :role', { role });
    // }
    // query.skip((queryDto.page - 1) * queryDto.limit);
    // query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['product.id', 'product.name', 'product.email', 'product.role', 'product.status']);

    const [products, total] = await query.getManyAndCount();

    return { products, total };
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { price, name, description } = createProductDto;

    const product = this.create();
    product.price = price;
    product.name = name;
    product.description = description;
    try {
      await product.save();
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }
}
