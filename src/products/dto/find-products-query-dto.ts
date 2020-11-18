import { BaseQueryParametersDto } from '../../shared/dto/base-query-paramers.dto';

export class FindProductsQueryDto extends BaseQueryParametersDto {
  id: string;
  name: string;
  price: number;
  description: string;
}
