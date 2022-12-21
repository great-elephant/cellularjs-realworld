import { env } from '$share/env';
import { sign } from 'jsonwebtoken'

export interface JwtClaims {
  userId: number;
}

export const jwt = {
  sign(payload: JwtClaims) {
    return sign(payload, env().JWT_SECRET);
  },
};
