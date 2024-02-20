import { v4 as uuid } from 'uuid';

/* funcion quecambia nombre del file */
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  // trae de la file el tipo en la posicion 1
  //   ej el mimetype viene como mimetype: 'image/jpeg' con el split queda ['image', 'jpeg']
  //    sacamos el [1] q seria "jpeg"
  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
