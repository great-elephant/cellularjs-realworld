
import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { NotFound, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { formatUserRes } from 'user/$inner/helpers';
import { UserRepository } from 'user/$inner/user.data';
import { UpdateUserReq } from './update-user.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UpdateUserCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private userRepository: UserRepository,
    private updateUserReq: UpdateUserReq,
  ) { }

  async handle() {
    const { signInData, userRepository, updateUserReq } = this;
    const newEmail = updateUserReq.email;

    const user = await userRepository.findOneBy({ id: signInData.userId });
    if (!user) throw NotFound({ msg: 'User not found' });

    const userWithGivenEmail = await userRepository.findOneBy({ email: newEmail });
    if (userWithGivenEmail && userWithGivenEmail.id !== user.id) {
      throw Unprocessable({ msg: 'Email already exists' });
    }

    await userRepository.update(
      { email: newEmail },
      { id: user.id },
    );

    return formatUserRes({
      ...user,
      email: newEmail,
    });
  }
}
