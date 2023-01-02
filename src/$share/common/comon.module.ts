import { AuthModule } from '$share/auth';
import { env, Env } from '$share/env';
import { TransporterModule } from '$share/transporter';
import { TypeOrmModule } from '$share/typeorm';
import { Module } from '@cellularjs/di';
import { EnvModule } from '@cellularjs/env';
import { getLogger } from '@cellularjs/logger';

@Module({
  exports: [
    EnvModule.config({ token: Env }),
    AuthModule,
    TransporterModule,
    TypeOrmModule.initialize({
      name:'',
      type: 'postgres',
      host: env().DB_HOST,
      port: env().DB_PORT,
      username: env().DB_USER,
      password: env().DB_PASSWORD,
      database: env().DB_NAME,
      schema: env().DB_SCHEMA_NAME,
      synchronize: true,
    }),
  ],
})
export class CommonModule {
  onInit() {
    getLogger(CommonModule.name).info('initialized');
  }
}
