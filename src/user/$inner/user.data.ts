import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;
}

export interface UserRepository extends TypeOrmRepository<UserEntity> { }

@Repository(UserEntity)
export class UserRepository { }
