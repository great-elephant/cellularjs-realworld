import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column('simple-array')
  tagList: string[];

  @Column()
  author: number;

  @Column({ default: 0 })
  favoritesCount: number;
}

export interface ArticleRepository extends TypeOrmRepository<ArticleEntity> { }

@Repository(ArticleEntity)
export class ArticleRepository { }
