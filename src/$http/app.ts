import * as express from 'express';
import * as cors from 'cors';
import { createNetWork, IRS, transportListener } from '@cellularjs/net';
import { getLogger } from '@cellularjs/logger';
import { netCnfs } from '$share/net';
import { configRoutes } from './routes';

export async function initApp() {
  await createNetWork(netCnfs);

  const app = express();
  app.use(cors())
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.disable('x-powered-by');

  configRoutes(app);

  return app;
};

transportListener.on('fail', (ctx) => {
  if (ctx.originalError instanceof IRS) {
    getLogger(ctx.irq.header.to).error(JSON.stringify(ctx.originalError.body))
    return;
  }

  getLogger(ctx.irq.header.to).error(ctx.originalError?.stack || ctx.originalError)
});
