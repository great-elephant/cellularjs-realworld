import { env } from '$share/env';
import { IRQ } from '@cellularjs/net';
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

export function parseToken(irq: IRQ): SignInData {
  const token = irq.header.authorization?.split(' ')[1];

  return jwt.verify(token);
}
