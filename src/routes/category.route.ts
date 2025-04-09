import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

import {
  CATEGORY_KEY,
  CATEGORY_LIST_KEY,
  DEFAULT_EXPIRATION_TIME,
  redisClient,
} from "@/lib/redis";
import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category.repository";

const categoryRepository = new PostgresCategoryRepository();

export const categoryRoutes = new Elysia({
  prefix: "/categories",
  tags: ["Categories"],
})
  .get(
    "/",
    async () => {
      const categoriesCached = await redisClient.get(CATEGORY_LIST_KEY);

      if (categoriesCached) {
        return JSON.parse(categoriesCached);
      }

      const categories = await categoryRepository.findAll();

      await redisClient.set(
        CATEGORY_LIST_KEY,
        JSON.stringify(categories),
        "EX",
        DEFAULT_EXPIRATION_TIME,
      );

      return categories;
    },
    {
      detail: {
        summary: "List all categories",
        description: "Returns a list of all categories sorted by name",
        tags: ["Categories"],
      },
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
          }),
        ),
      },
    },
  )
  .get(
    "/:id",
    async ({ params, error }) => {
      const categoryCached = await redisClient.get(
        `${CATEGORY_KEY}${params.id}`,
      );

      if (categoryCached) {
        return JSON.parse(categoryCached);
      }

      const categoryToShow = await categoryRepository.findById(params.id);

      if (!categoryToShow) {
        return error(404, "Category not found");
      }

      await redisClient.set(
        `${CATEGORY_KEY}${params.id}`,
        JSON.stringify(categoryToShow),
        "EX",
        DEFAULT_EXPIRATION_TIME,
      );

      return categoryToShow;
    },
    {
      detail: {
        summary: "Get category by ID",
        description: "Returns a single category by its ID",
        tags: ["Categories"],
      },
      params: t.Object({
        id: t.String({
          description: "Category ID",
        }),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          name: t.String(),
        }),
        404: t.String(),
      },
    },
  )
  .get(
    "/query",
    async ({ query, error }) => {
      const categoryCached = await redisClient.get(
        `${CATEGORY_KEY}${query.name}`,
      );

      if (categoryCached) {
        return JSON.parse(categoryCached);
      }

      const categoryToShow = await categoryRepository.findByName(query.name);

      if (!categoryToShow) {
        return error(404, "Category not found");
      }

      await redisClient.set(
        `${CATEGORY_KEY}${query.name}`,
        JSON.stringify(categoryToShow),
        "EX",
        DEFAULT_EXPIRATION_TIME,
      );

      return categoryToShow;
    },
    {
      detail: {
        summary: "Find category by name",
        description: "Returns a single category by its name",
        tags: ["Categories"],
      },
      query: t.Object({
        name: t.String({
          description: "Category name to search for",
        }),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          name: t.String(),
        }),
        404: t.String(),
      },
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

      await redisClient.del(CATEGORY_LIST_KEY);

      return categoryRepository.save({
        id,
        name: body.name,
      });
    },
    {
      detail: {
        summary: "Create a new category",
        description: "Creates a new category with the provided name",
        tags: ["Categories"],
      },
      body: t.Object({
        name: t.String({
          description: "Name of the category",
        }),
      }),
      response: {
        201: t.Object({
          id: t.String(),
          name: t.String(),
        }),
        409: t.String(),
      },
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

      await Promise.all([
        redisClient.del(`${CATEGORY_KEY}${params.id}`),
        redisClient.del(CATEGORY_LIST_KEY),
      ]);

      await categoryRepository.update(categoryUpdated);
    },
    {
      detail: {
        summary: "Update a category",
        description: "Updates an existing category with the provided data",
        tags: ["Categories"],
      },
      params: t.Object({
        id: t.String({
          description: "Category ID to update",
        }),
      }),
      body: t.Object({
        name: t.Optional(
          t.String({
            description: "New name for the category",
          }),
        ),
      }),
      response: {
        204: t.Any(),
        404: t.String(),
        409: t.String(),
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set, error }) => {
      set.status = 204;

      await categoryRepository.delete(params.id);

      await Promise.all([
        redisClient.del(`${CATEGORY_KEY}${params.id}`),
        redisClient.del(CATEGORY_LIST_KEY),
      ]);
    },
    {
      detail: {
        summary: "Delete a category",
        description: "Deletes a category by its ID",
        tags: ["Categories"],
      },
      params: t.Object({
        id: t.String({
          description: "Category ID to delete",
        }),
      }),
      response: {
        204: t.Any(),
      },
    },
  );
