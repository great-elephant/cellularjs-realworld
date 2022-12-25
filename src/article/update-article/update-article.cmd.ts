import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { UpdateArticleReq } from './update-article.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UpdateArticleCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private updateArticleReq: UpdateArticleReq
  ) { }

  async handle() {
    const { signInData, articleRepository, updateArticleReq } = this;
    const article = await articleRepository.findOneBy({ slug: updateArticleReq.slug });

    if (!article) {
      throw NotFound();
    }

    if (article.author !== signInData.userId) {
      throw Forbidden();
    }

    const newArticle = await articleRepository.save({
      ...article,
      body: updateArticleReq.body,
    });

    return {
      article: {
        ...newArticle,
        favorited: false, // tmp hard code
      },
    };
  }
}
