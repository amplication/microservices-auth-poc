import { JWT_PUBLIC_KEY } from "../../constants";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";

export const jwtPublicKeyFactory = {
  provide: JWT_PUBLIC_KEY,
  useFactory: async (
    secretsService: SecretsManagerService
  ): Promise<string> => {
    const base64 = await secretsService.getSecret<string>(JWT_PUBLIC_KEY);
    const value = Buffer.from(base64!, "base64").toString("utf-8");

    if (!value) {
      throw new Error("Missing JWT_PUBLIC_KEY environment variable");
    }

    return value;
  },
  inject: [SecretsManagerService],
}