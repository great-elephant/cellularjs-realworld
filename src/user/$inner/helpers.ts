import { jwt } from '$share/auth';
import { User$CurrentUserRes } from '$share/msg';
import { UserEntity } from './user.data';

export function formatUserRes(user: UserEntity) {
  const { id, bio, email, image, username } = user;

  return {
    user: {
      id,
      bio,
      email,
      image,
      username,
      token: jwt.sign({ userId: id }),
    },
  } as User$CurrentUserRes;
}
