import { Elysia, t } from "elysia";

import { PostgresContactRepository } from "@/repositories/postgres/postgres-contact-repository";
import { RedisContactRepository } from "@/repositories/redis/redis-contact-repository";
import { ContactService } from "@/services/contact-service";

const contactRepository = new PostgresContactRepository();
const contactCache = new RedisContactRepository();
const contactService = new ContactService(contactRepository, contactCache);

export const contactRoutes = new Elysia({
  prefix: "/contacts",
  tags: ["Contacts"],
})
  .get(
    "/",
    async () => {
      return contactService.getAll();
    },
    {
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            email: t.String(),
            phone: t.String(),
            category: t.Object({
              name: t.Nullable(t.String()),
            }),
          }),
        ),
      },
      detail: {
        summary: "Get all contacts",
        description: "Returns a list of all contacts",
      },
    },
  )
  .get(
    "/:id",
    async ({ params, error }) => {
      return contactService.getById(params.id);
    },
    {
      params: t.Object({
        id: t.String({
          description: "Contact ID",
          examples: ["12345678-1234-1234-1234-123456789012"],
        }),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          name: t.String(),
          email: t.String(),
          phone: t.String(),
          categoryId: t.Optional(t.String()),
        }),
        404: t.String(),
      },
      detail: {
        summary: "Get a contact by id",
        description: "Returns a single contact by its ID",
      },
    },
  )
  .post(
    "/",
    async ({ body, set, error }) => {
      set.status = 201;

      return contactService.create(body);
    },
    {
      body: t.Object({
        name: t.String({
          description: "Contact name",
          examples: ["John Doe"],
        }),
        email: t.String({
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
      }),
      response: {
        201: t.Object({
          id: t.String(),
        }),
        409: t.String(),
      },
      detail: {
        summary: "Create a new contact",
        description: "Creates a new contact with the provided data",
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set, error }) => {
      set.status = 204;

      return contactService.update({
        id: params.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        categoryId: body.categoryId,
      });
    },
    {
      body: t.Object({
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
      }),
      params: t.Object({
        id: t.String({
          description: "Contact ID to update",
          examples: ["12345678-1234-1234-1234-123456789012"],
        }),
      }),
      response: {
        204: t.Any(),
        404: t.String(),
        409: t.String(),
      },
      detail: {
        summary: "Update a contact",
        description: "Updates an existing contact with the provided data",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      set.status = 204;

      return contactService.delete(params.id);
    },
    {
      params: t.Object({
        id: t.String({
          description: "Contact ID to delete",
          examples: ["12345678-1234-1234-1234-123456789012"],
        }),
      }),
      response: {
        204: t.Any(),
      },
      detail: {
        summary: "Delete a contact",
        description: "Deletes a contact by its ID",
      },
    },
  );
