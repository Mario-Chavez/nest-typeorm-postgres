import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async runSeed() {
    this.insertNewProduct(); //llama a insertNewProduct
    return 'SEDD EXECUTED';
  }

  private async insertNewProduct() {
    /* llama a borrar todos los product del serviceProduct */
    await this.productService.deleteAllProduct();

    const products = initialData.products; //trae la data q tenemos en seed-data

    const insertPromises = []; //inicializamos un insertPromise como [] vacio

    /* aqui recorremos el product con foreach y vamos creando en la tabla product
    cada producto que nos viene en initial data */
    products.forEach((product) => {
      //guarda cada product en la tabla e inserta en insertPromise
      insertPromises.push(this.productService.create(product));
    });
    await Promise.all(insertPromises); //esperamos que se inserte la data inicial  en insertPromise

    return true;
  }
}
