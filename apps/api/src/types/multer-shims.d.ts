/**
 * Declaración mínima de tipos para "multer" (no instala @types/multer;
 * solo usamos memoryStorage y StorageEngine dentro de FileInterceptor).
 */
declare module "multer" {
  type StorageEngine = object;

  interface MulterOptions {
    storage?: StorageEngine;
    limits?: {
      fileSize?: number;
      files?: number;
      parts?: number;
      fields?: number;
    };
  }

  export function memoryStorage(opts?: never): StorageEngine;
}