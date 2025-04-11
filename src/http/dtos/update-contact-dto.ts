import { t } from "elysia";

export const updateContactDto = t.Object({
  name: t.Optional(
    t.String({
      description: "Contact name",
      examples: ["John Doe"],
    }),
  ),
  email: t.Optional(
    t.String({
      format: "email",
      description: "Contact email",
      examples: ["john@example.com"],
    }),
  ),
  phone: t.Optional(
    t.String({
      description: "Contact phone",
      examples: ["+5581999999999"],
    }),
  ),
  categoryId: t.Optional(
    t.String({
      description: "Contact category id",
      examples: ["123e4567-e89b-12d3-a456-426614174000"],
    }),
  ),
});
