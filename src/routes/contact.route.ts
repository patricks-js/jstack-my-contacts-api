import { InMemoryContactRepository } from "@/repositories/in-memory/in-memory-contact.repository";
import { ContactService } from "@/services/contact.service";
import { Elysia } from "elysia";

const contactService = new ContactService(new InMemoryContactRepository());

export const contactRoutes = new Elysia({ prefix: "/contacts" }).get(
  "/",
  async () => contactService.index(),
);
