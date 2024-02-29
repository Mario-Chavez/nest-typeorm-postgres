import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Product Title',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Price',
    type: Number,
    example: 19.99,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Description',
    type: String,
  })
  @IsString()
  @IsOptional()
  desciption?: string;

  @ApiProperty({
    description: 'Slug',
    type: String,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Stock',
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Sizes',
    type: [String],
    example: ['small', 'medium', 'large'],
  })
  @IsString({ each: true }) //cada uno de los elemnt del arreglo debe ser string
  @IsArray()
  @IsOptional()
  sizes: string[];

  @ApiProperty({
    description: 'Gender',
    enum: ['men', 'woman', 'kid', 'unisex'],
  })
  @IsIn(['men', 'woman', 'kid', 'inisex'])
  gender: string;

  @ApiProperty({
    description: 'Tags',
    type: [String],
    example: ['casual', 'sport', 'formal'],
  })
  @IsString({ each: true }) //cada uno de los elemnt del arreglo debe ser string
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'Images',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsString({ each: true }) //cada uno de los elemnt del arreglo debe ser string
  @IsArray()
  @IsOptional()
  images?: string[];
}
