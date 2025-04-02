import type {
  Contact,
  ContactRepository,
} from "@/repositories/contact.repository";
import { randomUUIDv7 } from "bun";

export class InMemoryContactRepository implements ContactRepository {
  #contacts: Contact[] = [
    {
      id: randomUUIDv7(),
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
      categoryId: randomUUIDv7(),
    },
    {
      id: randomUUIDv7(),
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "987654321",
      categoryId: randomUUIDv7(),
    },
  ];

  async findAll(): Promise<Contact[]> {
    return this.#contacts;
  }
}
