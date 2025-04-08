import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { categoryRoutes } from "./routes/category.route";
import { contactRoutes } from "./routes/contact.route";

export const app = new Elysia()
  .use(swagger())
  .use(contactRoutes)
  .use(categoryRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
