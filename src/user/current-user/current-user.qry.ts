
import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound } from '$share/msg';
import { Service, ServiceHandler } from '@cellularjs/net';
import { formatUserRes } from 'user/$inner/helpers';
import { UserRepository } from 'user/$inner/user.data';

@Auth()
@Service({ scope: 'publish' })
export class CurrentUserQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private userRepository: UserRepository,
  ) { }

  async handle() {
    const { signInData, userRepository } = this;
    const user = await userRepository.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: 'User not found' });

    return formatUserRes(user);
  }
}
