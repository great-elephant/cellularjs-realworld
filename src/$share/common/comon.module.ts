import { Env } from "$share/env";
import { Module } from "@cellularjs/di";
import { EnvModule } from "@cellularjs/env/dist";
import { getLogger, LogLevel } from "@cellularjs/logger/dist";

@Module({
  imports: [
    EnvModule.config({
      token: Env,
    }),
  ],
})
export class CommonModule {
  onInit() {
    getLogger(CommonModule.name).info('initialized');
  }
}
