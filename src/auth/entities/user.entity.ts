import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  @ApiProperty({ description: 'User email', format: 'email' })
  email: string;

  @Column('text', { select: false }) // no muestra la contraseña en las tablas qu etiene relacion
  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @Column('text')
  @ApiProperty({ description: 'User full name' })
  fullName: string;

  @Column('bool', { default: true })
  @ApiProperty({ description: 'User status (active or inactive)' })
  isActive: boolean;

  @ApiProperty({ enum: ['user', 'super-admin', 'user'], example: ['user'] })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  /*marcamos la tabla Product,  product.user es donde se va a relacionar*/
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  /* guardamos en minuscalas el email */
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  /* tb para actualizar */
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
