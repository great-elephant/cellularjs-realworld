import { CommonModule } from '$share/common';
import { TypeOrmModule } from '$share/typeorm';
import { Cell } from '@cellularjs/net';
import { UserEntity } from './$inner/user.data';

@Cell({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: ['./'],
  listen: './'
})
export class User { }
