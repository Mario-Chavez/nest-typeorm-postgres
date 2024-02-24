import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in (request)');

    /*Si no viene data muestra el user completo 
    si viene data muestra los campos de la data (EJ email)
    */
    return !data ? user : user[data];
  },
);
