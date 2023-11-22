import { User } from "./user";

export abstract class Auth {
  abstract user: User;
  abstract accessToken: string;
  abstract refreshToken?: string;
}
