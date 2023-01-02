import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository  } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('article_comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  articleId: number;

  @Column()
  authorId: number;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

export interface CommentRepository extends TypeOrmRepository<CommentEntity> { }

@Repository(CommentEntity)
export class CommentRepository { }
