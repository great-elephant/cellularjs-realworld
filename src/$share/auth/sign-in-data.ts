export interface JwtClaims {
  userId: number;
}

export class SignInData { }
export interface SignInData extends JwtClaims {
  iat: number;
}
