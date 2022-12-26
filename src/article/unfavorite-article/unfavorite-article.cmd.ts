
import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleEntity, ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UnfavoriteArticleCmd implements ServiceHandler {
  private article: ArticleEntity;

  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private favoriteRepository: FavoriteRepository,
    private irq: IRQ,
  ) { }

  async handle() {
    const { irq, signInData, articleRepository, favoriteRepository } = this;
    const article = await articleRepository.findOneBy({ slug: irq.body.slug });

    this.article = article;

    if (!article) throw NotFound();

    if (await this.isFavorited()) return this.returnArticle();

    await favoriteRepository.delete({
      userId: signInData.userId,
      articleId: article.id,
    });

    article.favoritesCount -= 1;
    const newArticle = await articleRepository.save(article);

    return this.returnArticle(newArticle);
  }

  private async isFavorited() {
    return !!await this.favoriteRepository.findOneBy({
      userId: this.signInData.userId,
      articleId: this.article.id,
    });
  }

  private async returnArticle(newArticle?: ArticleEntity) {
    const article = newArticle || await this.articleRepository.findOneBy({ id: this.article.id });

    return {
      article: {
        ...article,
        favorited: false,
      },
    };
  }
}
