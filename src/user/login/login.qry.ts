
import { UnAuthorized } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { formatUserRes } from 'user/$inner/helpers';
import { UserRepository } from 'user/$inner/user.data';
import { LoginReq } from './login.req';

@Service({ scope: 'publish' })
export class LoginQry implements ServiceHandler {
  constructor(
    private userRepository: UserRepository,
    private loginReq: LoginReq
  ) { }

  async handle() {
    const { userRepository, loginReq } = this;
    const user = await userRepository.findOneBy({ email: loginReq.email });

    if (!user || user.password !== loginReq.password) {
      throw UnAuthorized({ msg: 'Your email or password is incorrect'});
    }

    return formatUserRes(user);
  }
}
