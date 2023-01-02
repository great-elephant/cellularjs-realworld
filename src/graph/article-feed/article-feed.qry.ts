import { Auth, SignInData } from '$share/auth';
import { UserPublicData, User$SearchQryRes, Article$SearchQryRes, ArticleData } from '$share/msg';
import { Transporter } from '$share/transporter';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';

@Auth()
@Service({ scope: 'publish' })
export class ArticleFeedQry implements ServiceHandler {
  private searchIrq: IRQ;

  constructor(
    irq: IRQ,
    private signInData: SignInData,
    private transporter: Transporter,
  ) {
    this.searchIrq = new IRQ(
      { to: 'Article:SearchQry' },
      { limit: Math.min(irq.body.limit || 20, 100), offset: irq.body.offset || 0 },
    );
  }

  async handle() {
    const { transporter } = this;
    const { users }: User$SearchQryRes = (await transporter.send(new IRQ(
      { to: 'User:SearchQry' },
      { followerId: this.signInData.userId }
    ))).body;

    if (!users.length) {
      return { articles: [], articlesCount: 0 };
    }

    this.searchIrq = this.searchIrq.withBody({ ...this.searchIrq.body, authorIds: users.map(u => u.id) })

    const res: Article$SearchQryRes = (await transporter.send(this.searchIrq)).body;

    return {
      ...res,
      articles: this.bindingAuthor(res.articles, users)
    };
  }

  private async bindingAuthor(articles: ArticleData[], users: UserPublicData[]) {
    return articles.map(article => {
      const author = users.find(user => user.id === article.author);
      return { ...article, author };
    });
  }
}
