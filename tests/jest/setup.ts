import 'tsconfig-paths/register';
import * as supertest from 'supertest';
import { faker } from '@faker-js/faker';
import type { Response } from 'express'
import { initApp } from '$http/app';
import { User } from './type';

beforeAll(async () => {
  const app = await initApp();

  globalThis.__APP__ = app;

  globalThis.user = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    token: '',
  }

  globalThis.celeb = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    token: '',
  }

  await register();

  await bindAuthToken(globalThis.user);
  await bindAuthToken(globalThis.celeb);
});

async function register() {
  const user = globalThis.user;
  const celeb = globalThis.celeb;

  await supertest(globalThis.__APP__)
    .post('/api/users')
    .send({ user })
    .set('Accept', 'application/json')
    .expect(200);

  await supertest(globalThis.__APP__)
    .post('/api/users')
    .send({ user: celeb })
    .set('Accept', 'application/json')
    .expect(200);
}

async function bindAuthToken(user: User) {
  const res: Response = await supertest(globalThis.__APP__)
    .post('/api/users/login')
    .send({ user })
    .set('Accept', 'application/json');

  const userRes = (res as any)._body.user;

  user.token = userRes.token;
}
