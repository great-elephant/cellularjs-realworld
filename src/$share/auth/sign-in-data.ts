import { addProxy, ProxyHandler, Injectable } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { parseToken } from './jwt';

export class JwtClaims {
  userId: number;
}

const InjectSignInData = () => aClass => {
  addProxy(aClass, { proxy: SignInDataProxy });
  return aClass;
}

@Injectable()
class SignInDataProxy implements ProxyHandler {
  constructor(
    private irq: IRQ,
  ) { }

  async handle() {
    const { irq } = this;

    try { return parseToken(irq); }
    catch { }
  }
}

@InjectSignInData()
export class SignInData extends JwtClaims {
  iat: number;
}
