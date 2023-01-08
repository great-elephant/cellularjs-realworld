import * as supertest from 'supertest';
import { faker } from '@faker-js/faker';

describe('User', () => {
  it('User:RegisterCmd', async () => {
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await supertest(globalThis.__APP__)
      .post('/api/users')
      .send({
        user: {
          email,
          username,
          password,
        }
      })
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('User:LoginQry', async () => {
    const user = globalThis.user;

    await supertest(globalThis.__APP__)
      .post('/api/users/login')
      .send({
        user: {
          email: user.email,
          password: user.password,
        }
      })
      .set('Accept', 'application/json')
      .expect(200);
  })

  it('User:GetUserQry', async () => {
    const user = globalThis.user;
    await supertest(globalThis.__APP__)
      .get(`/api/profiles/${user.username}`)
      .set('Accept', 'application/json')
      .expect(200);

    await supertest(globalThis.__APP__)
      .get('/api/profiles/___')
      .set('Accept', 'application/json')
      .expect(404);
  });
});
