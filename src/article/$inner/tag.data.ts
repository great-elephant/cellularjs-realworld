import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('article_tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

export interface TagRepository extends TypeOrmRepository<TagEntity> { }

@Repository(TagEntity)
export class TagRepository { }
