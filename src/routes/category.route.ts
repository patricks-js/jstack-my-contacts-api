import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category.repository";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

const categoryRepository = new PostgresCategoryRepository();

export const categoryRoutes = new Elysia({ prefix: "/categories" })
  .get("/", async () => {
    return categoryRepository.findAll();
  })
  .get("/:id", async ({ params, error }) => {
    const categoryToShow = await categoryRepository.findById(params.id);

    if (!categoryToShow) {
      return error(404, "Category not found");
    }

    return categoryToShow;
  })
  .get(
    "/query",
    async ({ query, error }) => {
      const categoryToShow = await categoryRepository.findByName(query.name);

      if (!categoryToShow) {
        return error(404, "Category not found");
      }

      return categoryToShow;
    },
    {
      query: t.Object({
        name: t.String(),
      }),
    },
  )
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
