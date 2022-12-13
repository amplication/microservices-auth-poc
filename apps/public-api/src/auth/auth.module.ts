import { forwardRef, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JWT_EXPIRATION, JWT_PUBLIC_KEY } from "../constants";
import { SecretsManagerModule } from "../providers/secrets/secretsManager.module";
import { SecretsManagerService } from "../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { jwtPublicKeyFactory } from "./jwt/jwtSecretFactory";
//@ts-ignore

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
        const base64PublicKey = await secretsService.getSecret<string>(JWT_PUBLIC_KEY);
        if (!base64PublicKey) {
          throw new Error("Missing JWT_PUBLIC_KEY environment variable");
        }
        const publicKey = Buffer.from(base64PublicKey!, "base64").toString("utf-8");

        const expiresIn = configService.get(JWT_EXPIRATION);
        if (!expiresIn) {
          throw new Error("Missing JWT_EXPIRATION environment variable");
        }
        
        return {
          publicKey,
          signOptions: { expiresIn, algorithm: "RS256" },
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    jwtPublicKeyFactory,
  ],
  controllers: [],
  exports: [],
})
export class AuthModule {}
