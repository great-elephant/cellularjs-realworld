import { proxyTo } from '$share/express-proxy';
import { Express, Router } from 'express';

export function configRoutes(app: Express) {
  // /api/users
  const usersRouter = Router()
    .post('/', proxyTo('User:RegisterCmd'))
    .post('/login', proxyTo('User:LoginQry'));

  app.use('/api/users', usersRouter);

  // /api/profiles
  const profilesRouter = Router()
    .get('/:username', proxyTo('User:GetUserQry'))
    .post('/:username/follow', proxyTo('User:FollowUserCmd'))
    .delete('/:username/follow', proxyTo('User:UnfollowUserCmd'))

  app.use('/api/profiles', profilesRouter);

  // /api/user
  const userRouter = Router()
    .get('/', proxyTo('User:CurrentUserQry'))
    .put('/', proxyTo('User:UpdateUserCmd'));

  app.use('/api/user', userRouter);

  // /api/articles
  const articlesRouter = Router()
    .post('/', proxyTo('Article:CreateArticleCmd'))
    .get('/', proxyTo('Article:SearchQry'))
    .get('/:slug', proxyTo('Article:GetArticleQry'))
    .delete('/:slug', proxyTo('Article:DeleteArticleCmd'))
    .put('/:slug', proxyTo('Article:UpdateArticleCmd'))
    .post('/:slug/favorite', proxyTo('Article:FavoriteArticleCmd'))
    .delete('/:slug/favorite', proxyTo('Article:UnfavoriteArticleCmd'));

  app.use('/api/articles', articlesRouter);

  // /api/tags
  const tagRouter = Router()
    .get('/', proxyTo('Article:GetTagsQry'));

  app.use('/api/tags', tagRouter);
}
