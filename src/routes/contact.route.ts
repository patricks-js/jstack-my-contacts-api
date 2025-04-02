import { InMemoryContactRepository } from "@/repositories/in-memory/in-memory-contact.repository";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

const contactRepository = new InMemoryContactRepository();

export const contactRoutes = new Elysia({ prefix: "/contacts" })
  .get("/", async () => {
    return contactRepository.findAll();
  })
  .get("/:id", async ({ params, error }) => {
    const contactToShow = await contactRepository.findById(params.id);

    if (!contactToShow) {
      return error(404, "Contact not found");
    }

    return contactToShow;
  })
  .post(
    "/",
    async ({ body, set, error }) => {
      set.status = 201;

      const id = randomUUIDv7();

      const emailAlreadyTaken = await contactRepository.findByEmail(body.email);

      if (emailAlreadyTaken) {
        return error(409, "Email already taken");
      }

      return contactRepository.save({
        id,
        ...body,
      });
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({
          format: "email",
        }),
        phone: t.String(),
        categoryId: t.String(),
      }),
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

      set.status = 204;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(
          t.String({
            format: "email",
          }),
        ),
        phone: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    },
  )
  .delete("/:id", async ({ params, set }) => {
    set.status = 204;

    await contactRepository.delete(params.id);
  });
