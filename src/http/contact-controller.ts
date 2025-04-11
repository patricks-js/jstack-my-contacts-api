import { Elysia, t } from "elysia";

import { PostgresContactRepository } from "@/repositories/postgres/postgres-contact-repository";
import { RedisContactRepository } from "@/repositories/redis/redis-contact-repository";
import { ContactService } from "@/services/contact-service";
import { createContactDto } from "./dtos/create-contact-dto";
import {
  getAllContactsDto,
  getContactDto,
  getContactParamsDto,
} from "./dtos/fetch-contact-dto";
import { updateContactDto } from "./dtos/update-contact-dto";

const contactRepository = new PostgresContactRepository();
const contactCache = new RedisContactRepository();
const contactService = new ContactService(contactRepository, contactCache);

export const contactController = new Elysia({
  prefix: "/contacts",
  tags: ["Contacts"],
})
  .get(
    "/",
    async () => {
      return contactService.getAll();
    },
    {
      detail: {
        summary: "Get all contacts",
        description: "Returns a list of all contacts",
      },
      response: {
        200: getAllContactsDto,
      },
    },
  )
  .get(
    "/:id",
    async ({ params, error }) => {
      return contactService.getById(params.id);
    },
    {
      detail: {
        summary: "Get a contact by id",
        description: "Returns a single contact by its ID",
      },
      params: getContactParamsDto,
      response: {
        200: getContactDto,
        404: t.String(),
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
      detail: {
        summary: "Create a new contact",
        description: "Creates a new contact with the provided data",
      },
      body: createContactDto,
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

      return contactService.update({
        id: params.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        categoryId: body.categoryId,
      });
    },
    {
      detail: {
        summary: "Update a contact",
        description: "Updates an existing contact with the provided data",
      },
      body: updateContactDto,
      params: getContactParamsDto,
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

      return contactService.delete(params.id);
    },
    {
      detail: {
        summary: "Delete a contact",
        description: "Deletes a contact by its ID",
      },
      params: getContactParamsDto,
      response: {
        204: t.Any(),
      },
    },
  );
