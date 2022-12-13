import { forwardRef, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JWT_EXPIRATION, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from "../constants";
import { SecretsManagerModule } from "../providers/secrets/secretsManager.module";
import { SecretsManagerService } from "../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { BasicStrategy } from "./basic/basic.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { jwtPrivateKeyFactory, jwtPublicKeyFactory } from "./jwt/jwtSecretFactory";
import { PasswordService } from "./password.service";
//@ts-ignore
import { TokenService } from "./token.service";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    SecretsManagerModule,
    JwtModule.registerAsync({
      imports: [SecretsManagerModule],
      inject: [SecretsManagerService, ConfigService],
      useFactory: async (
        secretsService: SecretsManagerService,
        configService: ConfigService
      ) => {
        const base64PrivateKey = await secretsService.getSecret<string>(JWT_PRIVATE_KEY);
        if (!base64PrivateKey) {
          throw new Error("Missing JWT_PRIVATE_KEY environment variable");
        }
        
        const base64PublicKey = await secretsService.getSecret<string>(JWT_PUBLIC_KEY);
        if (!base64PublicKey) {
          throw new Error("Missing JWT_PUBLIC_KEY environment variable");
        }
        
        const privateKey = Buffer.from(base64PrivateKey!, "base64").toString("utf-8");
        const publicKey = Buffer.from(base64PublicKey!, "base64").toString("utf-8");

        const expiresIn = configService.get(JWT_EXPIRATION);
        if (!expiresIn) {
          throw new Error("Missing JWT_EXPIRATION environment variable");
        }

        return {
          privateKey,
          publicKey,
          signOptions: { expiresIn, algorithm: "RS256" },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    BasicStrategy,
    PasswordService,
    AuthResolver,
    JwtStrategy,
    jwtPrivateKeyFactory,
    jwtPublicKeyFactory,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
