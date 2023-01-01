import { CommonModule } from '$share/common';
import { TypeOrmModule } from '$share/typeorm';
import { Cell } from '@cellularjs/net';
import { UserEntity } from './$inner/user.data';
import { UserFollowEntity } from './$inner/user_follow.data';

@Cell({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserEntity, UserFollowEntity]),
  ],
  providers: ['./'],
  listen: './'
})
export class User { }
