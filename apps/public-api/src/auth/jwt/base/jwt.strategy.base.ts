import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAuthStrategy } from "../../IAuthStrategy";
import { UserInfo } from "../../UserInfo";

export class JwtStrategyBase
  extends PassportStrategy(Strategy)
  implements IAuthStrategy
{
  constructor(
    protected readonly secretOrKey: string
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: UserInfo): Promise<UserInfo> {
    return { ...payload };
  }
}
