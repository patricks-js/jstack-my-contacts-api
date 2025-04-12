import { Elysia, t } from "elysia";

import { container } from "@/config/container";
import { CategoryService } from "@/services/category-service";
import { createCategoryDto } from "./dtos/create-category-dto";
import {
  getAllCategoriesDto,
  getCategoryDto,
  getCategoryParamsDto,
  getCategoryQueryDto,
} from "./dtos/fetch-category-dto";
import { updateCategoryDto } from "./dtos/update-categoty-dto";

const categoryService = container.resolve(CategoryService);

export const categoryController = new Elysia({
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
      },
      response: {
        200: getAllCategoriesDto,
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
      },
      params: getCategoryParamsDto,
      response: {
        200: getCategoryDto,
        404: t.String(),
      },
    },
  )
  .get(
    "/query",
    async ({ query }) => {
      return categoryService.getByName(query.name);
    },
    {
      detail: {
        summary: "Find category by name",
        description: "Returns a single category by its name",
      },
      query: getCategoryQueryDto,
      response: {
        200: getCategoryDto,
        404: t.String(),
      },
    },
  )
  .post(
    "/",
    async ({ body, set }) => {
      set.status = 201;

      return categoryService.create(body);
    },
    {
      detail: {
        summary: "Create a new category",
        description: "Creates a new category with the provided name",
      },
      body: createCategoryDto,
      response: {
        201: getCategoryDto,
        409: t.String(),
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
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
      },
      params: getCategoryParamsDto,
      body: updateCategoryDto,
      response: {
        204: getCategoryDto,
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
      },
      params: getCategoryParamsDto,
      response: {
        204: t.Any(),
      },
    },
  );
