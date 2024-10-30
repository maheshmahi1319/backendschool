import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../src/auth/auth.module";
import { UserModule } from "../src/users/user.module";
import { AppConfigModule } from "./config/config.module";
import { AppConfigService } from "./config/config.service";
import { DatabaseModule } from "./database/migrations/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
    AuthModule,
    UserModule,
    AppConfigModule,
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        type: "postgres",
        host: configService.dbConfig.host,
        port: configService.dbConfig.port,
        username: configService.dbConfig.username,
        password: configService.dbConfig.password,
        database: configService.dbConfig.database,
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true, // Recommended to keep false in production
        logging: true, // This will log SQL queries for debugging
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class AppModule {}
