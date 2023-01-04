import { Injectable } from '@cellularjs/di';
import { send, IRQ } from '@cellularjs/net';

@Injectable()
export class Transporter {
  constructor(
    private incomingIrq: IRQ,
  ) { }

  send(irq: IRQ) {
    // `send` is just a function call, there is no http request here!
    return send(irq.withHeaderItem(
      'authorization',
      this.incomingIrq.header.authorization,
    ));
  }
}
