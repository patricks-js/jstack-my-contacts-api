import type { ContactRepository } from "@/repositories/contact.repository";

export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  index() {
    return this.contactRepository.findAll();
  }

  show() {
    return "Show a register";
  }

  store() {
    return "Create a register";
  }

  update() {
    return "Update a register";
  }

  destroy() {
    return "Delete a register";
  }
}
