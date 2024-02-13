import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dtos';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExeptions(error); // funcion privada de error
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: relaciones
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term }); //find Id
    } else {
      /* crea un queryBuilder para hacer la busqueda de title  y slug devolviendo el primer
      alemento */
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        // aqui pone en mayuscula UPPER todas las letra de title
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toUpperCase(), //mayuscula
          slug: term.toLowerCase(), //minuscula
        })
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product whith termino: ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
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
}
