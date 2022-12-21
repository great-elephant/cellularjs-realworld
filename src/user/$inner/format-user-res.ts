import { jwt } from "$share/auth";
import { UserEntity } from "./user.data";

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
  };
}
