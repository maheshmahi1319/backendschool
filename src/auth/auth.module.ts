import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigModule } from "../config/config.module"; // Adjust the path as necessary
import { AppConfigService } from "../config/config.service";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/user.module";

// dist/auth/auth.module.js
@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule], // Add this line
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        return {
          secret: appConfigService.jwtSecret,
          signOptions: { expiresIn: "15m" },
        };
      },
    }),
    // ... other imports ...
  ],
  providers: [AuthService],
  controllers: [AuthController],
  // ... other configurations ...
})
export class AuthModule {}
