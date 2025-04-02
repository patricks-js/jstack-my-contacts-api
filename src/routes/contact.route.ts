import { InMemoryContactRepository } from "@/repositories/in-memory/in-memory-contact.repository";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";

const inMemoryContactRepository = new InMemoryContactRepository();

export const contactRoutes = new Elysia({ prefix: "/contacts" })
  .get("/", async () => {
    return inMemoryContactRepository.findAll();
  })
  .get("/:id", async ({ params, error }) => {
    const contactToShow = await inMemoryContactRepository.findById(params.id);

    if (!contactToShow) {
      return error(404, "Contact not found");
    }

    return contactToShow;
  })
  .post(
    "/",
    async ({ body, set }) => {
      set.status = 201;

      const id = randomUUIDv7();

      return inMemoryContactRepository.save({
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
  .delete("/:id", async ({ params, set }) => {
    set.status = 204;

    await inMemoryContactRepository.delete(params.id);
  });
