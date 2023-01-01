
import { SignInData } from '$share/auth';
import { NotFound } from '$share/msg';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { UserRepository } from 'user/$inner/user.data';
import { UserFollowRepository } from 'user/$inner/user_follow.data';

@Service({ scope: 'publish' })
export class GetUserQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private userRepository: UserRepository,
    private userFollowRepository: UserFollowRepository,
    private irq: IRQ,
  ) { }

  async handle() {
    const { irq,signInData, userRepository, userFollowRepository } = this;
    const user = await userRepository.findOneBy({ username: irq.body.username });

    if (!user) throw NotFound({ msg: 'User not found' });

    const isFollowed = !!await userFollowRepository.findOneBy({
      followeeId: signInData.userId,
      followerId: user.id,
    })

    const { bio, email, image, username } = user;

    return {
      user: {
        bio,
        email,
        image,
        username,
        following: isFollowed,
      }
    };
  }
}
