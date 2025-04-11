import { t } from "elysia";

export const createContactDto = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 255,
    description: "Contact name",
    examples: ["John Doe"],
  }),
  email: t.String({
    minLength: 3,
    maxLength: 255,
    format: "email",
    description: "Contact email",
    examples: ["john@example.com"],
  }),
  phone: t.String({
    description: "Contact phone",
    examples: ["+5581999999999"],
  }),
  categoryId: t.String({
    description: "Contact category id",
    examples: ["123e4567-e89b-12d3-a456-426614174000"],
  }),
});
