import { Elysia, t } from "elysia";

import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category-repository";
import { RedisCategoryRepository } from "@/repositories/redis/redis-category-repository";
import { CategoryService } from "@/services/category-service";

const categoryRepository = new PostgresCategoryRepository();
const categoryCache = new RedisCategoryRepository();
const categoryService = new CategoryService(categoryRepository, categoryCache);

export const categoryRoutes = new Elysia({
  prefix: "/categories",
  tags: ["Categories"],
})
  .get(
    "/",
    async () => {
      return categoryService.getAll();
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
    async ({ params }) => {
      return categoryService.getById(params.id);
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
          examples: ["12345678-1234-1234-1234-123456789012"],
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
      return categoryService.getByName(query.name);
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
          examples: ["Friends"],
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

      return categoryService.create(body);
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
          examples: ["Friends"],
        }),
      }),
      response: {
        201: t.Object({
          id: t.String(),
        }),
        409: t.String(),
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set, error }) => {
      set.status = 204;

      return categoryService.update({
        id: params.id,
        name: body.name,
      });
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
          examples: ["12345678-1234-1234-1234-123456789012"],
        }),
      }),
      body: t.Object({
        name: t.Optional(
          t.String({
            description: "New name for the category",
            examples: ["Friends"],
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
    async ({ params, set }) => {
      set.status = 204;

      return categoryService.delete(params.id);
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
          examples: ["12345678-1234-1234-1234-123456789012"],
        }),
      }),
      response: {
        204: t.Any(),
      },
    },
  );
