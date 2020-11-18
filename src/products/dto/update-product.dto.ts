import { IsString, IsOptional } from 'class-validator';
export class UpdateProductDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de produto válido',
  })
  name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  description: string;
}
