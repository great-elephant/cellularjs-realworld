import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class DeleteArticleCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private irq: IRQ,
  ) { }

  async handle() {
    const { signInData, articleRepository, irq } = this;
    const article = await articleRepository.findOneBy({ slug: irq.body.slug });

    if (!article) {
      throw NotFound();
    }

    if (article.author !== signInData.userId) {
      throw Forbidden({ msg: 'You are not the author of this article' });
    }

    await articleRepository.delete(article.id);
  }
}
