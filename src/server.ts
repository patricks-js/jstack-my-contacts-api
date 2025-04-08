import { Elysia } from "elysia";
import { categoryRoutes } from "./routes/category.route";
import { contactRoutes } from "./routes/contact.route";

const app = new Elysia().use(contactRoutes).use(categoryRoutes).listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
