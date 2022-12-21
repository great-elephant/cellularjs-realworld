import { env } from '$share/env';
import { sign, verify } from 'jsonwebtoken'
import { JwtClaims, SignInData } from './sign-in-data';

export const jwt = {
  sign(payload: JwtClaims) {
    return sign(payload, env().JWT_SECRET);
  },

  verify(token: string) {
    return verify(token, env().JWT_SECRET) as SignInData;
  }
};
