import * as supertest from 'supertest';

describe('Article', () => {
  it('Article:CreateArticleCmd + Article:DeleteArticleCmd', async () => {
    const user = globalThis.user;

    const newArticleRes = await supertest(globalThis.__APP__)
      .post('/api/articles')
      .send({
        article: {
          title: 'How to train your dragon 6',
          description: 'Ever wonder how?',
          body: 'Very carefully.',
          tagList: ['training', 'dragons']
        }
      })
      .set('Authorization', `Token ${user.token}`)
      .set('Accept', 'application/json')
      .expect(200);

    const article = newArticleRes._body.article;

    // Delete article by other user(not the author)
    await supertest(globalThis.__APP__)
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Token ${globalThis.celeb.token}`)
      .set('Accept', 'application/json')
      .expect(403);

    await supertest(globalThis.__APP__)
      .post(`/api/articles/${article.slug}/favorite`)
      .set('Authorization', `Token ${globalThis.celeb.token}`)
      .set('Accept', 'application/json')
      .expect(200);

    await supertest(globalThis.__APP__)
      .delete(`/api/articles/${article.slug}/favorite`)
      .set('Authorization', `Token ${globalThis.celeb.token}`)
      .set('Accept', 'application/json')
      .expect(200);

    await supertest(globalThis.__APP__)
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Token ${user.token}`)
      .set('Accept', 'application/json')
      .expect(200);

    await supertest(globalThis.__APP__)
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Token ${user.token}`)
      .set('Accept', 'application/json')
      .expect(404);
  });
});
