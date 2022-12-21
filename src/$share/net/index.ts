import { NetworkConfig } from "@cellularjs/net";
import { User } from "user/user.cell";

export const netCnfs: NetworkConfig = [
  { name: User.name, driver: User },
];
