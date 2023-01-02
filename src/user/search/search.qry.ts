
import { SignInData } from '$share/auth';
import { User$SearchQryRes } from '$share/msg';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { SelectQueryBuilder } from 'typeorm';
import { UserEntity, UserRepository } from 'user/$inner/user.data';
import { UserFollowRepository } from 'user/$inner/user_follow.data';
import { SearchReq } from './search.req';

@Service({ scope: 'publish' })
export class SearchQry implements ServiceHandler {
  private offset: number;
  private limit: number;
  private qb: SelectQueryBuilder<UserEntity>;

  constructor(
    userRepository: UserRepository,
    private irq: IRQ,
    private userFollowRepository: UserFollowRepository,
    private signInData?: SignInData,
  ) {
    const query: SearchReq = irq.body;
    this.offset = query.offset || 0;
    this.limit = Math.min(query.limit || 20, 100);

    this.qb = userRepository
      .createQueryBuilder('user')
      .offset(this.offset)
      .limit(this.limit);
  }

  async handle() {
    const { irq } = this;
    const query: SearchReq = irq.body;

    if (query.username) {
      this.qb.where('user.username = :username', { username: query.username });

    } else if (query.userIds) {
      query.userIds.length !== 0
        ? this.qb.where('user.id IN (:...userIds)', { userIds: query.userIds })
        : this.qb.where('0=1');

    } else if (query.followerId) {
      this.queryByFollower(query.followerId);
    }

    const users = await this.qb.getMany();
    const userFollowList = await this.getUserFollowList(users);

    return {
      users: users.map(user => ({
        id: user.id,
        bio: user.bio,
        image: user.image,
        username: user.username,
        following: !!(userFollowList.find(uFollow => uFollow.followeeId === user.id)),
      })),
    } as User$SearchQryRes;
  }

  private async getUserFollowList(users: UserEntity[]) {
    if (!this.signInData || !users.length) return [];

    return await this
      .userFollowRepository
      .getUserFollowList(users.map(u => u.id), this.signInData.userId);
  }

  private queryByFollower(followerId: number) {
    const userFollowQb = this.userFollowRepository
      .createQueryBuilder('userFollow')
      .select('userFollow.followeeId')
      .where(`userFollow.followerId = :followerId`);

    this.qb.where(`user.id IN (${userFollowQb.getQuery()})`, { followerId })
  }
}
