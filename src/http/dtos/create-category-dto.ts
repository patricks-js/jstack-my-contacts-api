import { t } from "elysia";

export const createCategoryDto = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 255,
    description: "Name of the category",
    examples: ["Friends"],
  }),
});
