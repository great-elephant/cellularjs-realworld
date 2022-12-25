import { NetworkConfig } from "@cellularjs/net";
import { Article } from "article/article.cell";
import { User } from "user/user.cell";

export const netCnfs: NetworkConfig = [
  { name: User.name, driver: User },
  { name: Article.name, driver: Article },
];
