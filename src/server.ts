import { Elysia } from "elysia";
import "reflect-metadata";

import swagger from "@elysiajs/swagger";
import { categoryController } from "./http/category-controller";
import { contactController } from "./http/contact-controller";

// TODO: add error handling
// TODO: add custom logging
export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Contact List API",
          version: "1.0.0",
        },
        openapi: "3.1.0",
      },
    }),
  )
  .use(contactController)
  .use(categoryController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
