import { SignInData } from '$share/auth/sign-in-data';
import { Article$SearchQryRes } from '$share/msg';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleEntity, ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';
import { SelectQueryBuilder } from 'typeorm';
import { SearchReq } from './search.req';

@Service({ scope: 'publish' })
export class SearchQry implements ServiceHandler {
  private qb: SelectQueryBuilder<ArticleEntity>;
  private limit: number;
  private offset: number;

  constructor(
    articleRepository: ArticleRepository,
    private favoriteRepository: FavoriteRepository,
    private irq: IRQ,
    private signInData?: SignInData,
  ) {
    this.qb = articleRepository.createQueryBuilder('article');
    this.limit = Math.min(irq.body.limit || 20, 100);
    this.offset = irq.body.offset || 0;
  }

  async handle() {
    const { irq, qb } = this;
    const query: SearchReq = irq.body;

    qb.limit(this.limit)
      .offset(this.offset)
      .orderBy('article.createdAt', 'DESC');

    if (query.authorId) {
      this.qb.andWhere('article.author = :authorId', { authorId: query.authorId });

    } else if (query.authorIds) {
      this.qb.andWhere('article.author IN (:...authorIds)', { authorIds: query.authorIds });

    } else if (query.favoritedBy) {
      await this.queryByUserFavorited(query.favoritedBy);
    }

    if (query.tag) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    const [articles, articlesCount] = await qb.getManyAndCount();

    return {
      articles: await this.bindingFavorited(articles),
      articlesCount,
    } as Article$SearchQryRes;
  }

  private async queryByUserFavorited(favoritedBy: number) {
    const favoritesQb = this.favoriteRepository
      .createQueryBuilder('favorite')
      .select('favorite.articleId')
      .offset(this.offset)
      .limit(this.limit)
      .where('favorite.userId = :userId')

    this.qb.andWhere(`article.id IN (${favoritesQb.getQuery()})`, { userId: favoritedBy });
  }

  private async bindingFavorited(articles: ArticleEntity[]) {
    if (!articles.length) return;

    const { signInData, favoriteRepository } = this;

    if (!signInData) {
      return articles.map(article => ({ ...article, favorited: false }));
    }

    const favorites = await favoriteRepository.createQueryBuilder('favorite')
      .where('favorite.articleId IN (:...articles)', { articles: articles.map(a => a.id) })
      .andWhere('favorite.userId = :userId', { userId: signInData.userId })
      .getMany();

    const articleIds = favorites.map(f => f.articleId);

    return articles.map(article => ({
      ...article,
      favorited: articleIds.includes(article.id),
    }));
  }
}
