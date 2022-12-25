import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { CreateArticleReq } from './create-article.req';
const slugify = require('slugify');

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class CreateArticleCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private createArticleReq: CreateArticleReq
  ) { }

  async handle() {
    const { signInData, articleRepository, createArticleReq } = this;

    const uniqSlug = await this.genUniqSlug(createArticleReq.title);
    const newArticle = await articleRepository.save({
      ...createArticleReq,
      tagList: createArticleReq.tagList || [],
      slug: uniqSlug,
      author: signInData.userId,
    });

    return {
      article: {
        ...newArticle,
        favorited: false,
      },
    };
  }

  private async genUniqSlug(title: string) {
    const slug = slugify(title, { lower: true }) + '-' + (new Date()).getTime().toString(36);
    const isSlugExisted = !!await this.articleRepository.findOneBy({ slug });

    if (isSlugExisted) {
      return await this.genUniqSlug(title);
    }

    return slug;
  }
}
