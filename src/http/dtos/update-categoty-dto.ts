import { t } from "elysia";

export const updateCategoryDto = t.Object({
  name: t.Optional(
    t.String({
      minLength: 3,
      maxLength: 255,
      description: "Name of the category",
      examples: ["Friends"],
    }),
  ),
});
