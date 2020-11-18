import {
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({
    message: 'Informe um preço',
  })
  price: number;

  @IsNotEmpty({
    message: 'Informe o nome do produto',
  })
  @MaxLength(200, {
    message: 'O nome deve ter menos de 100 caracteres',
  })
  name: string;

  description: string;
}
