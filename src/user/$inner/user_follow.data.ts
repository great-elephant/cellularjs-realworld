import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('user_follow')
export class UserFollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followeeId: number;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

export interface UserFollowRepository extends TypeOrmRepository<UserFollowEntity> { }

@Repository(UserFollowEntity)
export class UserFollowRepository {
}
