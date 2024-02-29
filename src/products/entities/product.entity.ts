import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '2ab92a5b-1c7f-48b0-8cf4-f24075bfbddc',
    description: 'productID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt teslo',
    description: 'Title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'product price',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: ' description product dsfhfdjksdfhs dfsafdjdflkj  ffff fsl',
    description: 'Product desacription',
    default: null,
  })
  @Column('text', { nullable: true })
  desciption: string;

  @ApiProperty({
    example: 't_shirt teslo',
    description: 'product-SLUG -  for SEO',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'L', 'XL', 'S'],
    description: 'Sizes',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'Women',
    description: 'Gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, //muestrala relaciones de otra tabla
  })
  images?: ProductImage[];

  /* utilizamos la tabla User, user.product es donde se va a relacionar*/
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  /* antes de la insercion nos fijamos si viene un slug sino le seteamos como slug el titulo
  que es requerido, despues hace el remplazo de los espacios vacios en _ y ' a '' y remplazamos
  todo. tb si viene un slug lo remplaza por _ y '' */
  @BeforeInsert()
  checkoSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
  /* update de slug  */
  @BeforeUpdate()
  checkoSlugUpdate() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
