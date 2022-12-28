import { Service, ServiceHandler } from '@cellularjs/net';
import { TagRepository } from 'article/$inner/tag.data';

@Service({ scope: 'publish' })
export class GetTagsQry implements ServiceHandler {
  constructor(
    private tagRepository: TagRepository,
  ) { }

  async handle() {
    const { tagRepository } = this;
    const tags = await tagRepository.createQueryBuilder('tag')
      // .offset(0).limit(20)
      .orderBy('tag.createdAt', 'DESC')
      .getMany();

    return {
      tags: tags.map(t => t.label),
    };
  }
}
