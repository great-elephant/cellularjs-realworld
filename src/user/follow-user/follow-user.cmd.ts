
import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound, User$FollowUserCmdRes } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { UserEntity, UserRepository } from 'user/$inner/user.data';
import { UserFollowRepository } from 'user/$inner/user_follow.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class FollowUserCmd implements ServiceHandler {
  private user: UserEntity;

  constructor(
    private irq: IRQ,
    private signInData: SignInData,
    private userRepository: UserRepository,
    private userFollowRepository: UserFollowRepository,
  ) { }

  async handle() {
    const { irq, signInData, userRepository, userFollowRepository } = this;
    const user = await userRepository.findOneBy({ username: irq.body.username });
    this.user = user;

    if (!user) throw NotFound();

    if (await this.isFollowed()) return this.returnUser();

    await userFollowRepository.save({ followerId: signInData.userId, followeeId: user.id });

    return this.returnUser();
  }

  private async isFollowed() {
    return !!await this.userFollowRepository.findOneBy({
      followerId: this.signInData.userId,
      followeeId: this.user.id,
    });
  }

  private async returnUser() {
    const { bio, image, username } = this.user;

    return {
      user: {
        bio,
        image,
        username,
        following: true,
      },
    } as User$FollowUserCmdRes;
  }
}
