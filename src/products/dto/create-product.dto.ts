import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  desciption?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true }) //cada uno de los elemnt del arreglo debe ser string
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'woman', 'kid', 'inisex'])
  gender: string;
}
