import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dtos';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource, //para usar el query runner
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      /* traemos una instancia de createProductDto y le agregamos las images */
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user, //id del user q crea
        /* creamos en la tabla productImage las  imagenes que nos pasan en el create   
        typeOrm guarda automaticamente el id del producto en la tabla de product-image*/
        images: images.map(
          (image) => this.productImageRepository.create({ url: image }), //mapea cada una de las imag y la asigana a imagenes
        ),
      });
      await this.productRepository.save(product);

      return { ...product, images }; // devuelve las image en un []
    } catch (error) {
      this.handleDBExeptions(error); // funcion privada de error
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      // mostramos las relaciones de la otra tabla de product_image
      relations: {
        images: true,
      },
    });

    /* retornamos las img sin formato de objetos con id */
    return product.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term }); //find Id
    } else {
      /* crea un queryBuilder para hacer la busqueda de title  y slug devolviendo el primer
      alemento */
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        // aqui pone en mayuscula UPPER todas las letra de title
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toUpperCase(), //mayuscula
          slug: term.toLowerCase(), //minuscula
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product whith termino: ${term} not found`);
    return product;
  }

  /* metodo creado para devolver las img sin id  llama al fondOne de arriba*/
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((img) => img.url), // no devuelvo el id
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }

    /* create query runner */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //conecta
    await queryRunner.startTransaction(); //inicia la transacciones

    try {
      if (images) {
        /* borra de la tabla de productImage el product que tenga el id de product q estamos
        queriendo actualizar*/
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        /* guarda en la tabla product image las imagenes pero todavia no impacta la tabla */
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user; //user que viene del GetUser del controller()
      await queryRunner.manager.save(product); //guarda parcialmente
      await queryRunner.commitTransaction(); //aplica los cambios a la tabla
      await queryRunner.release(); //desconect

      /* devolvemos los datos actualizado co la funcion findOnePlain */
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction(); // si hay error vuelve atras
      await queryRunner.release(); //se vuelve a desconectar del queryruner
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExeptions(error: any) {
    this.logger.error(error); //muestra error en la consola
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }
    // console.log(error);
    throw new InternalServerErrorException(
      'Uneexpected error, check server logs',
    );
  }

  /* Delete all products */
  async deleteAllProduct() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute(); //delete todo los productos
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
}
