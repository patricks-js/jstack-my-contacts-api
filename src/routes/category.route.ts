import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category.repository";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

const categoryRepository = new PostgresCategoryRepository();

export const categoryRoutes = new Elysia({ prefix: "/categories" })
  .get("/", async () => {
    return categoryRepository.findAll();
  })
  .post(
    "/",
    async ({ body, set, error }) => {
      set.status = 201;

      const id = randomUUIDv7();

      const categoryAlreadyExists = await categoryRepository.findByName(
        body.name,
      );

      if (categoryAlreadyExists) {
        return error(409, "Category already exists");
      }

      return categoryRepository.save({
        id,
        name: body.name,
      });
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  );
