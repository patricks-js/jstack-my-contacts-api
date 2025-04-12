import { Elysia } from "elysia";
import "reflect-metadata";

import { swaggerPlugin } from "./config/swagger";
import { categoryController } from "./http/category-controller";
import { contactController } from "./http/contact-controller";

// TODO: add error handling
// TODO: add custom logging
export const app = new Elysia()
  .use(swaggerPlugin)
  .use(contactController)
  .use(categoryController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
