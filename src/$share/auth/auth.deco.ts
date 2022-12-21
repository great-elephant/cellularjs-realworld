import { UnAuthorized } from "$share/msg";
import { Injectable } from "@cellularjs/di"
import { addServiceProxies, ServiceHandler, IRQ, NextHandler } from "@cellularjs/net"
import { jwt } from "./jwt";
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

    const token = irq.header.authorization?.split(' ')[1];
    if (!token) {
      throw UnAuthorized();
    }

    let signInData: SignInData;
    try { signInData = jwt.verify(token); }
    catch { throw UnAuthorized(); }

    const extModule = nextHandler.getExtModule();
    await extModule.addProvider({ token: SignInData, useValue: signInData });

    return await nextHandler.handle();
  }
}
