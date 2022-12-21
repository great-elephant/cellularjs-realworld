import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Injectable, addProxy, ProxyContext } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { BadRequest } from '$share/msg';

type DataGetter = (irq: IRQ) => any;

export const ValidateReq = (dataGetter?: DataGetter) => (aClass) => {
  addProxy(aClass, { proxy: ValidateReqProxy, meta: { dataGetter } });

  Injectable()(aClass);

  return aClass
};

@Injectable()
class ValidateReqProxy {
  constructor(
    private irq: IRQ,
    private ctx: ProxyContext<{ dataGetter?: DataGetter }>,
  ) { }

  async handle() {
    const { irq, ctx } = this;
    const data = ctx.meta.dataGetter ? ctx.meta.dataGetter(irq) : irq.body;
    const dto = plainToInstance(ctx.token, data);
    const errors = await validate(dto);

    if (errors.length) {
      throw BadRequest({ errors });
    }

    return dto;
  }
}
