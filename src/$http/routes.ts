import { proxyTo } from '$share/express-proxy';
import { Express, Router } from 'express';

export function configRoutes(app: Express) {
  // users
  const usersRouter = Router();
  usersRouter.post('/', proxyTo('User:RegisterCmd'));
  usersRouter.post('/login', proxyTo('User:LoginQry'));
  app.use('/api/users', usersRouter);

}
