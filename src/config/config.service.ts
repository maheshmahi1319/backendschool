import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/user.entity";

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>("JWT_SECRET", "default_jwt_secret"); // Default value
  }

  get dbConfig() {
    return {
      type: "postgres",
      host: this.configService.get<string>("DB_HOST", "localhost"), // Default value
      port: parseInt(this.configService.get<string>("DB_PORT", "5432"), 10), // Default value
      username: this.configService.get<string>("DB_USERNAME", "kepler"), // Default value
      password: this.configService.get<string>("DB_PASSWORD", "kepler"), // Default value
      database: this.configService.get<string>("DB_NAME", "kepler"), // Default value
      entities: [User],
      synchronize: true, // turn off in production
      logging: true, // This will log SQL queries for debugging

    };
  }
}
