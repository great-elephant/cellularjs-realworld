import { Module } from "@cellularjs/di";
import { Transporter } from "./transporter";

@Module({
  exports: [Transporter],
})
export class TransporterModule { }
