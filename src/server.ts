import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { categoryRoutes } from "./routes/category.route";
import { contactRoutes } from "./routes/contact.route";

export const app = new Elysia()
  .use(swagger())
  .onError(({ error, code }) => {
    console.error(error, code);
  })
  .onRequest(({ request }) => {
    const url = request.url.split("localhost")[1];
    console.log(`${request.method} ${url}`);
  })
  .use(contactRoutes)
  .use(categoryRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
