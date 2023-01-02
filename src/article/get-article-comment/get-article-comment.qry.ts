import { Article$GetArticleCommentQryRes } from '$share/msg';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { CommentRepository } from 'article/$inner/comment.data';

@Service({ scope: 'publish' })
export class GetArticleCommentQry implements ServiceHandler {
  constructor(
    private irq: IRQ,
    private articleRepository: ArticleRepository,
    private commentRepository: CommentRepository,
  ) { }

  async handle() {
    const { irq, articleRepository, commentRepository } = this;

    const article = await articleRepository.findOneBy({ slug: irq.body.slug });

    if (!article) return { comments: [] };

    const comments = await commentRepository.findBy({ articleId: article.id });

    return { comments } as Article$GetArticleCommentQryRes;
  }
}
