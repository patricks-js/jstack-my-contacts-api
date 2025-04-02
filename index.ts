import { Elysia } from "elysia";
import { contactRoutes } from "./src/routes/contact.route";

const app = new Elysia().use(contactRoutes).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
