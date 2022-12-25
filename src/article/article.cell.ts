import { CommonModule } from '$share/common';
import { TypeOrmModule } from '$share/typeorm';
import { Cell } from '@cellularjs/net';
import { UserRepository } from 'user/$inner/user.data';
import { ArticleEntity } from './$inner/article.data';
import { FavoriteEntity } from './$inner/favorite.data';

@Cell({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([ArticleEntity, FavoriteEntity]),
  ],
  providers: ['./', UserRepository],
  listen: './'
})
export class Article { }
