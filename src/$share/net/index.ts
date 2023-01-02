import { NetworkConfig } from "@cellularjs/net";
import { Article } from "article/article.cell";
import { Graph } from "graph/graph.cell";
import { User } from "user/user.cell";

export const netCnfs: NetworkConfig = [
  { name: User.name, driver: User },
  { name: Article.name, driver: Article },
  { name: Graph.name, driver: Graph },
];
