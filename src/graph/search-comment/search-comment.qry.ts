import { Article$GetArticleCommentQryRes, CommentData, User$SearchQryRes } from "$share/msg";
import { Transporter } from "$share/transporter";
import { IRQ, Service, ServiceHandler } from "@cellularjs/net";

@Service({ scope: 'publish' })
export class SearchCommentQry implements ServiceHandler {
  private searchIrq: IRQ;

  constructor(
    irq: IRQ,
    private transporter: Transporter,
  ) {
    this.searchIrq = new IRQ(
      { to: 'Article:GetArticleCommentQry' },
      { slug: irq.body.slug },
    );
  }

  async handle() {
    const { transporter } = this;

    const res: Article$GetArticleCommentQryRes =
      (await transporter.send(this.searchIrq)).body;

    res.comments = await this.bindingAuthor(res.comments);

    return res;
  }

  private async bindingAuthor(comments: CommentData[]) {
    const userIds = [...new Set(comments.map(comment => comment.authorId))];

    const usersRes: User$SearchQryRes = (await this.transporter.send(new IRQ(
      { to: 'User:SearchQry' },
      { userIds },
    ))).body;

    return comments.map(article => ({
      ...article,
      author: usersRes.users.find(user => user.id === article.authorId),
    }));
  }
}