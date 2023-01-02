export interface UserPublicData {
  id: number;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface CurrentUserData extends Omit<UserPublicData, 'following'> {
  email: string;
  token: string;
}

export interface User$SearchQryRes {
  users: UserPublicData[];
}

export interface User$GetUserQryRes {
  profile: UserPublicData;
}

export type User$FollowUserCmdRes = {
  user: UserPublicData;
}

export type User$CurrentUserRes = {
  user: CurrentUserData;
}
