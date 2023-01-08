// Refs:
// - https://stackoverflow.com/a/56984941

import type { Express } from 'express';

type User = {
  email: string;
  username: string;
  password: string;
  token: string;
}

declare global {
  var __APP__: Express;
  var user: User;
  var celeb: User;
}
