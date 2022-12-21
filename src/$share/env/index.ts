import { env as cllEnv } from '@cellularjs/env';

export class Env {
  NODE_PORT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SCHEMA_NAME: string;
  JWT_SECRET: string;
}

export const env = cllEnv<Env>;
