import { CommonModule } from '$share/common';
import { TypeOrmModule } from '$share/typeorm';
import { Cell } from '@cellularjs/net';
import { ArticleEntity } from './$inner/article.data';
import { CommentEntity } from './$inner/comment.data';
import { FavoriteEntity } from './$inner/favorite.data';
import { TagEntity } from './$inner/tag.data';

@Cell({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      ArticleEntity,
      FavoriteEntity,
      CommentEntity,
      TagEntity,
    ]),
  ],
  providers: ['./'],
  listen: './'
})
export class Article { }
