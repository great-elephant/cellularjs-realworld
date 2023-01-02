import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound } from '$share/msg';
import { Transporter } from '$share/transporter';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { CommentRepository } from 'article/$inner/comment.data';
import { AddCommentReq } from './add-comment.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class AddCommentCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private commentRepository: CommentRepository,
    private addCommentReq: AddCommentReq,
    private transporter: Transporter,
  ) { }

  async handle() {
    const { signInData, articleRepository, commentRepository, addCommentReq } = this;

    const article = await articleRepository.findOneBy({ slug: addCommentReq.slug });

    if (!article) {
      throw NotFound();
    }

    const newComment = await commentRepository.save({
      authorId: signInData.userId,
      articleId: article.id,
      body: addCommentReq.body,
    });

    return {
      comment: {
        ...newComment,
        author: await this.getAuthorInfo(),
      },
    };
  }

  private async getAuthorInfo() {
    const userRes = await this.transporter.send(new IRQ(
      { to: 'User:SearchQry'},
      { userIds: [this.signInData.userId] },
    ));

    return userRes.body.users[0];
  }
}
