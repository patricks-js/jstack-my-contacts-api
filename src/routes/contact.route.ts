import {
  CONTACT_KEY,
  CONTACT_LIST_KEY,
  DEFAULT_EXPIRATION_TIME,
  redisClient,
} from "@/lib/redis";
import { PostgresContactRepository } from "@/repositories/postgres/postgres-contact.repository";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

const contactRepository = new PostgresContactRepository();

export const contactRoutes = new Elysia({
  prefix: "/contacts",
  tags: ["Contacts"],
})
  .get(
    "/",
    async () => {
      const contactsCached = await redisClient.get(CONTACT_LIST_KEY);

      if (contactsCached) {
        return JSON.parse(contactsCached);
      }

      const contacts = await contactRepository.findAll();

      await redisClient.set(
        CONTACT_LIST_KEY,
        JSON.stringify(contacts),
        "EX",
        DEFAULT_EXPIRATION_TIME,
      );

      return contacts;
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
              name: t.String(),
            }),
          }),
        ),
      },
      detail: {
        summary: "Get all contacts",
      },
    },
  )
  .get(
    "/:id",
    async ({ params, error }) => {
      const contactCached = await redisClient.get(`${CONTACT_KEY}${params.id}`);

      if (contactCached) {
        return JSON.parse(contactCached);
      }

      const contactToShow = await contactRepository.findById(params.id);

      if (!contactToShow) {
        return error(404, "Contact not found");
      }

      await redisClient.set(
        `${CONTACT_KEY}${params.id}`,
        JSON.stringify(contactToShow),
        "EX",
        DEFAULT_EXPIRATION_TIME,
      );

      return contactToShow;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object({
          id: t.String(),
          name: t.String(),
          email: t.String(),
          phone: t.String(),
          categoryId: t.String(),
        }),
        404: t.String(),
      },
      detail: {
        summary: "Get a contact by id",
      },
    },
  )
  .post(
    "/",
    async ({ body, set, error }) => {
      set.status = 201;

      const id = randomUUIDv7();

      const emailAlreadyTaken = await contactRepository.findByEmail(body.email);

      if (emailAlreadyTaken) {
        return error(409, "Email already taken");
      }

      await redisClient.del(CONTACT_LIST_KEY);

      return contactRepository.save({
        id,
        ...body,
      });
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
          name: t.String(),
          email: t.String(),
          phone: t.String(),
          categoryId: t.String(),
        }),
        409: t.String(),
      },
      detail: {
        summary: "Create a new contact",
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set, error }) => {
      const contactToUpdate = await contactRepository.findById(params.id);

      if (!contactToUpdate) {
        return error(404, "Contact not found");
      }

      if (body.email) {
        const emailAlreadyTaken = await contactRepository.findByEmail(
          body.email,
        );

        if (emailAlreadyTaken) {
          return error(409, "Email already taken");
        }
      }

      const updatedContact = Object.assign({}, contactToUpdate, body);

      await contactRepository.update(updatedContact);

      await Promise.all([
        redisClient.del(`${CONTACT_KEY}${params.id}`),
        redisClient.del(CONTACT_LIST_KEY),
      ]);

      set.status = 204;
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
        id: t.String(),
      }),
      response: {
        204: t.Any(),
        404: t.String(),
        409: t.String(),
      },
      detail: {
        summary: "Update a contact",
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      set.status = 204;

      await contactRepository.delete(params.id);

      await Promise.all([
        redisClient.del(`${CONTACT_KEY}${params.id}`),
        redisClient.del(CONTACT_LIST_KEY),
      ]);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        204: t.Any(),
      },
      detail: {
        summary: "Delete a contact",
      },
    },
  );
