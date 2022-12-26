
import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleEntity, ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class FavoriteArticleCmd implements ServiceHandler {
  private article: ArticleEntity;

  constructor(
    private irq: IRQ,
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private favoriteRepository: FavoriteRepository,
  ) { }

  async handle() {
    const { irq, signInData, articleRepository, favoriteRepository } = this;
    const article = await articleRepository.findOneBy({ slug: irq.body.slug });
    this.article = article;

    if (!article) throw NotFound();

    if (await this.isFavorited()) return this.returnArticle();

    await favoriteRepository.save({ userId: signInData.userId, articleId: article.id });

    article.favoritesCount += 1;
    await articleRepository.save(article);

    return this.returnArticle();
  }

  private async isFavorited() {
    return !!await this.favoriteRepository.findOneBy({
      userId: this.signInData.userId,
      articleId: this.article.id,
    });
  }

  private async returnArticle() {
    const article = await this.articleRepository.findOneBy({ id: this.article.id });

    return {
      article: {
        ...article,
        favorited: true,
      },
    };
  }
}
