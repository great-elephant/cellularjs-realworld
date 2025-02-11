import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { User$SearchQryRes } from '$share/msg';
import { Transporter } from '$share/transporter';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { ArticleRepository } from 'article/$inner/article.data';
import { TagRepository } from 'article/$inner/tag.data';
import { CreateArticleReq } from './create-article.req';

const slugify = require('slugify');

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class CreateArticleCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private articleRepository: ArticleRepository,
    private tagRepository: TagRepository,
    private createArticleReq: CreateArticleReq,
    private transporter: Transporter,
  ) { }

  async handle() {
    const { signInData, articleRepository, createArticleReq } = this;
    const tagList = createArticleReq.tagList || [];

    await this.saveTags(tagList);

    const uniqSlug = await this.genUniqSlug(createArticleReq.title);

    const newArticle = await articleRepository.save({
      ...createArticleReq,
      tagList,
      slug: uniqSlug,
      author: signInData.userId,
    });

    return {
      article: {
        ...newArticle,
        favorited: false,
        author: await this.getAuthorInfo(),
      },
    };
  }

  private async saveTags(tagList: string[]) {
    if (!tagList.length) return;

    const tags = (await this.tagRepository.createQueryBuilder('tag')
      .where('tag.label IN (:...tag)', { tag: tagList })
      .getMany())
      .map(t => t.label);

    const newTags = tagList.filter(x => !tags.includes(x));

    if (!newTags.length) {
      return;
    }

    await this.tagRepository.insert(newTags.map(tag => ({
      label: tag,
    })));
  }

  private async genUniqSlug(title: string) {
    const slug = slugify(title, { lower: true }) + '-' + (new Date()).getTime().toString(36);
    const isSlugExisted = !!await this.articleRepository.findOneBy({ slug });

    if (isSlugExisted) {
      return await this.genUniqSlug(title);
    }

    return slug;
  }

  private async getAuthorInfo() {
    const userRes: User$SearchQryRes = (await this.transporter.send(new IRQ(
      { to: 'User:SearchQry'},
      { userIds: [this.signInData.userId] },
    ))).body;

    return userRes.users[0];
  }
}
