import { UnAuthorized } from "$share/msg";
import { Injectable } from "@cellularjs/di"
import { addServiceProxies, ServiceHandler, IRQ, NextHandler } from "@cellularjs/net"
import { jwt, parseToken } from "./jwt";
import { SignInData } from "./sign-in-data";

export const Auth = () => aClass => {
  addServiceProxies(aClass, [AuthProxy]);

  return aClass;
}

@Injectable()
class AuthProxy implements ServiceHandler {
  constructor(
    private irq: IRQ,
    private nextHandler: NextHandler,
  ) { }

  async handle() {
    const { irq, nextHandler } = this;

    let signInData: SignInData;
    try {
      signInData = parseToken(irq);
    } catch {
      throw UnAuthorized();
    }

    const extModule = nextHandler.getExtModule();
    await extModule.addProvider({ token: SignInData, useValue: signInData });

    return nextHandler.handle();
  }
}
