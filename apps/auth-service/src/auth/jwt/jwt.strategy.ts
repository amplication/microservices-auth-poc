import { Inject, Injectable } from "@nestjs/common";
import { JWT_PUBLIC_KEY } from "../../constants";
import { UserService } from "../../user/user.service";
import { JwtStrategyBase } from "./base/jwt.strategy.base";
@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    protected readonly userService: UserService,
    @Inject(JWT_PUBLIC_KEY) secretOrKey: string
  ) {
    super(userService, secretOrKey);
  }
}
