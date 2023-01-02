import { Article$SearchQryRes, ArticleData, Success, User$SearchQryRes, UserPublicData } from "$share/msg";
import { Transporter } from "$share/transporter";
import { IRQ, Service, ServiceHandler } from "@cellularjs/net";
import { SearchArticleReq } from "./search-article.req";

@Service({ scope: 'publish' })
export class SearchArticleQry implements ServiceHandler {
  private cachedUsers: UserPublicData[] = [];

  private searchIrq: IRQ;

  constructor(
    private irq: IRQ,
    private transporter: Transporter,
  ) {
    this.searchIrq = new IRQ(
      { to: 'Article:SearchQry' },
      { limit: irq.body.limit, offset: irq.body.offset, tag: irq.body.tag },
    );
  }

  async handle() {
    const { irq, transporter } = this;
    const query: SearchArticleReq = irq.body;

    if (query.favorited) {
      await this.searchByFavorite(query);
    } else if(query.author) {
      await this.searchByAuthor(query);
    }

    const res: Article$SearchQryRes = (await transporter.send(this.searchIrq)).body;

    return {
      ...res,
      articles: await this.bindingAuthor(res.articles),
    };
  }

  private async searchByFavorite(query: SearchArticleReq) {
    if (!query.favorited) return;
    const { transporter } = this;

    const usersRes: User$SearchQryRes = (await transporter.send(new IRQ(
      { to: 'User:SearchQry' },
      { username: query.favorited },
    ))).body;

    const user = usersRes.users[0];

    if (!user) {
      throw Success({ articles: [], articlesCount: 0 });
    }

    this.searchIrq = this.searchIrq.withBody({ ...this.searchIrq.body, favoritedBy: user.id })
  }

  private async searchByAuthor(query: SearchArticleReq) {
    if (!query.author) return;
    const { transporter } = this;

    const usersRes: User$SearchQryRes = (await transporter.send(new IRQ(
      { to: 'User:SearchQry' },
      { username: query.author, limit: query.limit, offset: query.offset },
    ))).body;

    const author = usersRes.users[0];

    if (!author) {
      throw Success({ articles: [], articlesCount: 0 });
    }

    this.cachedUsers.push(author)
    this.searchIrq = this.searchIrq.withBody({ ...this.searchIrq.body, authorId: author.id })
  }

  private async bindingAuthor(articles: ArticleData[]) {
    const userIds = articles
      .map(article => article.author)
      .filter(userId => !this.cachedUsers.find(u => u.id === userId));

    const usersRes: User$SearchQryRes = (await this.transporter.send(new IRQ(
      { to: 'User:SearchQry' },
      { userIds },
    ))).body;

    this.cachedUsers = this.cachedUsers.concat(...usersRes.users);

    return articles.map(article => {
      const author = this.cachedUsers.find(user => user.id === article.author);
      if (author) {
        return { ...article, author };
      }

      return article;
    });
  }
}
