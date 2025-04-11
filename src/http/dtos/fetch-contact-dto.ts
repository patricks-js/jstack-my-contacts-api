import { t } from "elysia";

export const getContactDto = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  phone: t.String(),
  category: t.Object({
    id: t.String(),
    name: t.String(),
  }),
});

export const getAllContactsDto = t.Array(getContactDto);

export const getContactParamsDto = t.Object({
  id: t.String({
    description: "Contact ID",
    examples: ["12345678-1234-1234-1234-123456789012"],
  }),
});
