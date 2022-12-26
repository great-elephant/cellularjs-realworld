import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository  } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('article_favorite')
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleId: number;

  @Column()
  userId: number;
}

export interface FavoriteRepository extends TypeOrmRepository<FavoriteEntity> { }

@Repository(FavoriteEntity)
export class FavoriteRepository { }
