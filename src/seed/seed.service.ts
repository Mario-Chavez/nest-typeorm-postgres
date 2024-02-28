import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    this.deleteTables(); //borra tablas
    const adminUser = await this.insertUsers();

    this.insertNewProduct(adminUser); //llama a insertNewProduct pasandole los usuarios
    return 'SEDD EXECUTED';
  }

  private async deleteTables() {
    await this.productService.deleteAllProduct(); //deleted products

    /* borra usuarios */
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  /* inserta y crea los usuario que viene del seedData */
  private async insertUsers() {
    const seeUsers = initialData.users;

    const users: User[] = [];

    seeUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUser = await this.userRepository.save(seeUsers);
    return dbUser[0]; //devuelve el primer user q es administrador
  }

  private async insertNewProduct(user: User) {
    /* llama a borrar todos los product del serviceProduct */
    await this.productService.deleteAllProduct();

    const products = initialData.products; //trae la data q tenemos en seed-data

    const insertPromises = []; //inicializamos un insertPromise como [] vacio

    /* aqui recorremos el product con foreach y vamos creando en la tabla product
    cada producto que nos viene en initial data */
    products.forEach((product) => {
      //guarda cada product en la tabla e inserta en insertPromise
      insertPromises.push(this.productService.create(product, user));
    });
    await Promise.all(insertPromises); //esperamos que se inserte la data inicial  en insertPromise

    return true;
  }
}
