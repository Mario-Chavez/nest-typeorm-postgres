import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'products_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE' }, // se borra la imagen si se borra el product
  )
  product: Product;
}
