import { jwt } from '$share/auth';
import * as crypto from 'crypto';
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

/**
 * Ref https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
 */
export const pwd = {
  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(8).toString('hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ":" + derivedKey.toString('hex'))
      });
    });
  },
  compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'))
      });
    })
  }
}