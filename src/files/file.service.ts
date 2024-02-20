import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FileService {
  geteStaticProductsImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName); // buscamos el path de la img

    /* si no existe badRequest */
    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }

    /* si exist mandamos el path */
    return path;
  }
}
