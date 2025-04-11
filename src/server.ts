import { Elysia } from "elysia";

import { swaggerPlugin } from "./config/swagger";
import { categoryRoutes } from "./routes/category.route";
import { contactRoutes } from "./routes/contact.route";

// TODO: add error handling
// TODO: add custom logging
export const app = new Elysia()
  .use(swaggerPlugin)
  .use(contactRoutes)
  .use(categoryRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
