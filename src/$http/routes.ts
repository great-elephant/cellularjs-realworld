import { proxyTo } from '$share/express-proxy';
import { Express, Router } from 'express';

export function configRoutes(app: Express) {
  // users
  const usersRouter = Router();
  usersRouter.post('/', proxyTo('User:RegisterCmd'));
  usersRouter.post('/login', proxyTo('User:LoginQry'));
  app.use('/api/users', usersRouter);

  // user
  const userRouter = Router();
  userRouter.get('/', proxyTo('User:CurrentUserQry'));
  userRouter.put('/', proxyTo('User:UpdateUserCmd'));
  app.use('/api/user', userRouter);

  // articles
  const articlesRouter = Router();
  articlesRouter.post('/', proxyTo('Article:CreateArticleCmd'));
  articlesRouter.get('/:slug', proxyTo('Article:GetArticleQry'));
  articlesRouter.delete('/:slug', proxyTo('Article:DeleteArticleCmd'));
  articlesRouter.put('/:slug', proxyTo('Article:UpdateArticleCmd'));

  app.use('/api/articles', articlesRouter);

}
