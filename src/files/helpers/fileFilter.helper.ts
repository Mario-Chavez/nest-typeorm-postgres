/* funcion que acepta o no un tipo de extension del file */

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  // trae de la file el tipo en la posicion 1
  //   ej el mimetype viene como mimetype: 'image/jpeg' con el split queda ['image', 'jpeg']
  //    sacamos el [1] q seria "jpeg"
  const fileExtension = file.mimetype.split('/')[1];
  const validExtendions = ['png', 'jpeg', 'gif', 'jpg'];

  /* si el file trae las validExtendion aceptamos el file*/
  if (validExtendions.includes(fileExtension)) {
    // aceptamos el file
    return callback(null, true);
  }
  /* caso contrario false */
  callback(null, false);
};
