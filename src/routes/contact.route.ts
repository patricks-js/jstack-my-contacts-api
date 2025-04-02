import { InMemoryContactRepository } from "@/repositories/in-memory/in-memory-contact.repository";
import { Elysia } from "elysia";

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
  });
