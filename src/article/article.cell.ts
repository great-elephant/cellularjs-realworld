import { CommonModule } from '$share/common';
import { TypeOrmModule } from '$share/typeorm';
import { Cell } from '@cellularjs/net';
import { UserRepository } from 'user/$inner/user.data';
import { ArticleEntity } from './$inner/article.data';
import { FavoriteEntity } from './$inner/favorite.data';
import { TagEntity } from './$inner/tag.data';

@Cell({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      ArticleEntity,
      FavoriteEntity,
      TagEntity,
    ]),
  ],
  providers: ['./', UserRepository],
  listen: './'
})
export class Article { }
