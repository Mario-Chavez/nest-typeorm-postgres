import { Response } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FileService } from './file.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, //Express
    @Param('imageName') imageName: string,
  ) {
    const path = this.fileService.geteStaticProductsImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter, // controla que se una extension permitida
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer, //agrega el nombre dela extension (png,jpg,gif)
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    //validacionque traiga imagen
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${file.filename}`;
    return { secureUrl };
  }
}