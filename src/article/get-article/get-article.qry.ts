import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';

@Service({ scope: 'publish' })
export class GetArticleQry implements ServiceHandler {
  constructor(
    private articleRepository: ArticleRepository,
    private irq: IRQ,
  ) { }

  async handle() {
    const { articleRepository, irq } = this;
    const article = await articleRepository.findOneBy({ slug: irq.body.slug });

    return {
      article: {
        ...article,
        favorited: false, // tmp hard code
      },
    };
  }
}
