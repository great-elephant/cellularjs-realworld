import { Module } from "@cellularjs/di";
import { SignInData } from "./sign-in-data";

@Module({
  exports: [SignInData],
})
export class AuthModule {}
