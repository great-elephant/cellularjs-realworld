import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';
import { UpdateArticleReq } from './update-article.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UpdateArticleCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private updateArticleReq: UpdateArticleReq,
    private articleRepository: ArticleRepository,
    private favoriteRepository: FavoriteRepository,
  ) { }

  async handle() {
    const {
      signInData,
      updateArticleReq,
      favoriteRepository,
      articleRepository,
    } = this;

    const article = await articleRepository.findOneBy({ slug: updateArticleReq.slug });
    if (!article) {
      throw NotFound();
    }

    if (article.author !== signInData.userId) {
      throw Forbidden();
    }

    const newArticle = await articleRepository.save({
      ...article,
      body: updateArticleReq.body,
    });

    const isFavorited = signInData
      ? !!await favoriteRepository.findOneBy({ articleId: article.id, userId: signInData.userId })
      : false;

    return {
      article: {
        ...newArticle,
        favorited: isFavorited,
      },
    };
  }
}
