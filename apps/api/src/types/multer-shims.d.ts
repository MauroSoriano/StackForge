/**
 * Declaración mínima de tipos para "multer" (no instala @types/multer;
 * solo usamos memoryStorage y StorageEngine dentro de FileInterceptor).
 */
declare module "multer" {
  // Representación mínima del motor de almacenamiento (no usamos sus detalles)
  type StorageEngine = object;

  // Opciones aceptadas por el middleware de subida de archivos
  interface MulterOptions {
    storage?: StorageEngine; // dónde se guardan los archivos (en memoria, aquí)
    limits?: {
      fileSize?: number; // tamaño máximo por archivo (bytes)
      files?: number; // número máximo de archivos
      parts?: number; // número máximo de partes multipart
      fields?: number; // número máximo de campos no-file
    };
  }

  // Guarda los archivos subidos en memoria (disponibles como Buffer)
  export function memoryStorage(opts?: never): StorageEngine;
}