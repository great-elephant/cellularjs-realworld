import { getLogger } from '@cellularjs/logger';
import { env } from '$share/env';
import { initApp } from './app';

(async () => {
  const logger = getLogger('HTTP App');

  try {
    const app = await initApp();

    const port = env().NODE_PORT;

    app.listen(port, () => logger.info(`ready for HTTP request (port: ${port})`));
  } catch (err) {
    logger.fatal(`failed to initialize\n${err}`);
  }
})();
