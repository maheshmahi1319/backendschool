import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import * as dotenv from "dotenv";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my NestJS application')
    .setVersion('1.0')
    .addTag('auth') // You can add tags as needed
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Enable versioning with the correct type
  app.enableVersioning({
    type: VersioningType.URI, // Use the VersioningType enum
  });


  // Enable validation for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove any fields not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if extra fields are provided
      transform: true, // Automatically transform payloads to DTO instances
    })
  );

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
