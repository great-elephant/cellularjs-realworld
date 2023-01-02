import type { ArticleEntity } from 'article/$inner/article.data';
import type { CommentEntity } from 'article/$inner/comment.data';

export type CommentData = CommentEntity;

export type ArticleData = ArticleEntity & {
  author: number;
}

export type Article$GetArticleCommentQryRes = {
  comments: CommentData[];
}

export type Article$SearchQryRes = {
  articles: ArticleData[];
  articlesCount: number;
}
