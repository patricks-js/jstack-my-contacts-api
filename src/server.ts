import "reflect-metadata";

import swagger from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import { Elysia } from "elysia";

import { categoryController } from "./http/category-controller";
import { contactController } from "./http/contact-controller";

// TODO: add error handling
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
  .use(
    logger({
      mode: "live",
      withTimestamp: true,
      withBanner: true,
    }),
  )
  .use(contactController)
  .use(categoryController)
  .listen(3000);
