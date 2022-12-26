import { SignInData } from '$share/auth/sign-in-data';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';

@Service({ scope: 'publish' })
export class GetArticleQry implements ServiceHandler {
  constructor(
    private irq: IRQ,
    private signInData: SignInData | undefined,
    private articleRepository: ArticleRepository,
    private favoriteRepository: FavoriteRepository,
  ) { }

  async handle() {
    const { irq, signInData, articleRepository, favoriteRepository } = this;
    const article = await articleRepository.findOneBy({ slug: irq.body.slug });

    const isFavorited = signInData
      ? !!await favoriteRepository.findOneBy({ articleId: article.id, userId: signInData.userId })
      : false;

    return {
      article: {
        ...article,
        favorited: isFavorited,
      },
    };
  }
}
