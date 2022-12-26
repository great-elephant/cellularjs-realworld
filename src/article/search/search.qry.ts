import { SignInData } from '$share/auth/sign-in-data';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleEntity, ArticleRepository } from 'article/$inner/article.data';
import { FavoriteRepository } from 'article/$inner/favorite.data';
import { SelectQueryBuilder } from 'typeorm';
import { UserRepository } from 'user/$inner/user.data';

@Service({ scope: 'publish' })
export class SearchQry implements ServiceHandler {
  private qb: SelectQueryBuilder<ArticleEntity>;
  private limit: number;
  private offset: number;

  constructor(
    articleRepository: ArticleRepository,
    private userRepository: UserRepository,
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
    const query = irq.body;

    qb.limit(this.limit);

    qb.offset(this.offset);

    if (query.author) {
      await this.queryByAuthor(query.author);
    }

    if (query.tag) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if (query.favorited) {
      await this.queryByUserFavorited(query.favorited);
    }

    qb.orderBy('article.createdAt', 'DESC');

    const [articles, articlesCount] = await qb.getManyAndCount();

    await this.bindingAuthor(articles);

    await this.bindingFavorited(articles);

    return { articles, articlesCount };
  }

  // Note: This is CLL Stage 1
  private async queryByUserFavorited(userName: string) {
    const user = await this.userRepository.findOneBy({ username: userName });
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .where('favorite.userId = :userId', { userId: user.id })
      .offset(this.offset)
      .limit(this.limit)
      .getMany();

    this.qb.andWhere('article.id IN (:...articleIds)', { articleIds: favorites.map(a => a.articleId) });
  }

  // Note: This is CLL Stage 1
  private async queryByAuthor(userName: string) {
    const author = await this.userRepository.findOneBy({ username: userName });
    this.qb.andWhere('article.author = :authorId', { authorId: author?.id || null });
  }

  // Note: This is CLL Stage 1
  private async bindingAuthor(articles: ArticleEntity[]) {
    if (!articles.length) return;
    const { userRepository } = this;

    const authors = await userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.bio', 'user.image'])
      .where('user.id IN (:...articles)', { articles: articles.map(a => a.author) })
      .getMany();

    articles.forEach(article => {
      (article as any).author = authors.find(a => a.id === article.author);
    })
  }

  private async bindingFavorited(articles: ArticleEntity[]) {
    if (!articles.length) return;

    const { signInData, favoriteRepository } = this;

    if (!signInData) {
      articles.forEach(article => (article as any).favorited = false);
      return;
    }

    const favorites = await favoriteRepository.createQueryBuilder('favorite')
      .where('favorite.articleId IN (:...articles)', { articles: articles.map(a => a.id) })
      .andWhere('favorite.userId = :userId', { userId: signInData.userId })
      .getMany();

    const articleIds = favorites.map(f => f.articleId);
    articles.forEach(article => {
      (article as any).favorited = articleIds.includes(article.id);
    });
  }
}
