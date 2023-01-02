import { Injectable } from '@cellularjs/di';
import { send, IRQ } from '@cellularjs/net';

@Injectable()
export class Transporter {
  constructor(
    private incomingIrq: IRQ,
  ) { }

  send(irq: IRQ) {
    return send(irq.withHeaderItem(
      'authorization',
      this.incomingIrq.header.authorization,
    ));
  }
}
