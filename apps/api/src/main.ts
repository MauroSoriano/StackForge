/**
 * Punto de entrada (bootstrap) de la API NestJS de StackForge.
 * Se encarga de crear la aplicación, aplicar la configuración global
 * (prefijo, CORS, cookies y validación), montar Swagger y arrancar el
 * servidor HTTP en el puerto configurado.
 */

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module.js";

/**
 * Arranca la aplicación Nest:
 * 1) crea la app a partir de AppModule,
 * 2) aplica la configuración global (prefijo, CORS, cookies, validación),
 * 3) genera y publica la documentación Swagger en /api/docs,
 * 4) escucha en el puerto indicado por PORT (4000 por defecto).
 * @returns Promesa que resuelve cuando el servidor ya está escuchando.
 */
async function bootstrap() {
  // Crea la aplicación Nest (resuelve todos los módulos, providers, etc.)
  const app = await NestFactory.create(AppModule);

  // Todas las rutas se montan bajo el prefijo /api
  app.setGlobalPrefix("api");
  // Habilita CORS reflejando el origen y permitiendo enviar cookies
  app.enableCors({ origin: true, credentials: true });
  // Habilita req.cookies para poder leer los tokens de sesión de las cookies
  app.use(cookieParser());
  // Valida/transforma automáticamente los DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      transform: true, // convierte el payload a instancias del DTO
      forbidNonWhitelisted: true, // rechaza la petición si llegan campos extra
    }),
  );

  // Define el título, versión y autenticación (Bearer) de la documentación
  const swaggerConfig = new DocumentBuilder()
    .setTitle("StackForge API")
    .setDescription("Plataforma Fullstack Learning — API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  // Genera el documento OpenAPI y expone la UI en /api/docs
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  // Puerto del servidor: variable de entorno PORT o 4000 por defecto
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  Logger.log(`API escuchando en http://localhost:${port}/api`, "Bootstrap");
}

// Ejecuta el arranque (void indica que no esperamos su resultado aquí)
void bootstrap();