import { t } from "elysia";

export const getCategoryDto = t.Object({
  id: t.String(),
  name: t.String(),
});

export const getAllCategoriesDto = t.Array(getCategoryDto);

export const getCategoryParamsDto = t.Object({
  id: t.String({
    description: "Category ID to update",
    examples: ["12345678-1234-1234-1234-123456789012"],
  }),
});

export const getCategoryQueryDto = t.Object({
  name: t.String({
    description: "Category name to search for",
    examples: ["Friends"],
  }),
});
