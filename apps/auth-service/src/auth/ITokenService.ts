import { Role } from "nest-access-control";

export interface ITokenPayload {
  id: string;
  username: string;
  roles: string[];
}

export interface ITokenService {
  createToken: ({ id, username, roles }: ITokenPayload) => Promise<string>;
}
