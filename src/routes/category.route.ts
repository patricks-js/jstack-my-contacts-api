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
  )
  .put(
    "/:id",
    async ({ params, body, set, error }) => {
      set.status = 204;

      const categoryToUpdate = await categoryRepository.findById(params.id);

      if (!categoryToUpdate || !body.name) {
        return error(404, "Category not found");
      }

      const categoryAlreadyExists = await categoryRepository.findByName(
        body.name,
      );

      if (categoryAlreadyExists) {
        return error(409, "Category already exists");
      }

      const categoryUpdated = Object.assign({}, categoryToUpdate, body);

      await categoryRepository.update(categoryUpdated);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, set, error }) => {
      set.status = 204;

      await categoryRepository.delete(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        204: t.Any(),
      },
    },
  );
