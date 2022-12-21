
import { Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { formatUserRes } from 'user/$inner/helpers';
import { UserRepository } from 'user/$inner/user.data';
import { RegisterReq } from './register.req';

@Transactional()
@Service({ scope: 'publish' })
export class RegisterCmd implements ServiceHandler {
  constructor(
    private userRepository: UserRepository,
    private registerReq: RegisterReq
  ) { }

  async handle() {
    const { userRepository, registerReq } = this;

    const isUserWithEmailExist = !!await userRepository.findOneBy({ email: registerReq.email });
    if (isUserWithEmailExist) {
      throw Unprocessable({ msg: 'Email already exists'});
    }

    const isUserWithUsernameExist = !!await userRepository.findOneBy({ username: registerReq.username });
    if (isUserWithUsernameExist) {
      throw Unprocessable({ msg: 'Username already exists'});
    }

    const newUser = await userRepository.save(registerReq);

    return formatUserRes(newUser);
  }
}
