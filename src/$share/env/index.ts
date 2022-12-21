import { env as cllEnv } from '@cellularjs/env';

export class Env {
  NODE_PORT: number;
}

export const env = cllEnv<Env>;
