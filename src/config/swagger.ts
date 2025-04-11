import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

export const swaggerPlugin = new Elysia().use(
  swagger({
    documentation: {
      info: {
        title: "Contact List API",
        version: "1.0.0",
      },
      openapi: "3.1.0",
    },
  }),
);
